class Bird {
    constructor(x, y, b) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.gravity = .1;
        this.radius = 20;
        this.fitness = 0;
        if (b) {
            this.brain = new NeuralNetwork(5, 2, 1, b);
        } else {
            this.brain = new NeuralNetwork(5, 2, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 255, .3)";
        ctx.fill();
    }

    update() {
        this.fitness += 1
        if (this.y + this.radius + 5 <= canvas.height && this.y - this.radius >= 0) {
            if (this.velocity < 10) {
                this.velocity += this.gravity;
            }
            this.y += this.velocity;
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocity = -.1;
        } else {
            this.death()
        }
    }

    async think() {
        let closestPipe = pipes[0];
        const dist = closestPipe.x + closestPipe.width < this.x - this.radius / 2
        if (dist) {
            closestPipe = pipes[1]
        }
        closestPipe.color = 'green'
        const inputs = [];
        inputs.push(this.y / canvas.height)
        inputs.push((this.velocity + .1) / 10.1)
        inputs.push(closestPipe.bottomY / canvas.height)
        inputs.push(closestPipe.topY / canvas.height)
        inputs.push(closestPipe.x / canvas.width)
        const result = await this.brain.predict(inputs);
        if (result > 0.5) {
            this.fly();
        }
    }

    fly() {
        this.velocity = -2
        this.velocity *= .95;
    }

    hit() {
        let closestPipe = pipes[0];
        const distToPipe = closestPipe.x + closestPipe.width < this.x - this.radius / 2
        if (distToPipe) {
            closestPipe = pipes[1]
        }
        const dist = (closestPipe.x + closestPipe.width) - (this.x + this.radius);
        const disty1 = (this.y + this.radius) - closestPipe.bottomY;
        const disty2 = closestPipe.topY - (this.y + this.radius);

        if ((dist < closestPipe.width && dist > 0) && (disty1 < this.radius * 2 || disty2 < 0)) {
            return true;
        } else {
            return false;
        }
    }
    death() {
        this.velocity = 0;
        this.y = canvas.height - this.radius;
    }

    getWeights() {
        return tf.tidy(() => {
            const copiedWeights = []
            const weights = this.brain.model.getWeights();
            for (let i = 0; i < weights.length; i++) {
                const data = weights[i].clone()
                copiedWeights.push(data)
            }
            return copiedWeights;
        })
    }

    async mutate(rate, weightsTensor, num) {
        let newWeights = [];
        for (let i = 0; i < weightsTensor.length; i++) {
            let shape = weightsTensor[i].shape;
            let weights = await weightsTensor[i].data();
            let weight = [];

            for (let j = 0; j < weights.length; j++) {
                if (rate >= Math.random()) {
                    weight.push(weights[j] + getRndInteger(-num, num) / 40);
                } else {
                    weight.push(weights[j])
                }
            }

            let newTensor = tf.tensor(weight, shape);
            newWeights.push(newTensor);
        }
        const newRandomModel = this.brain.createModel();
        newRandomModel.setWeights(newWeights);
        newWeights.forEach(e => {
            e.dispose()
        })
        return newRandomModel;


    }
}