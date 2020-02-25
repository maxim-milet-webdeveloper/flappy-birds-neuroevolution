class NeuralNetwork {
    constructor(a, b, c, d) {
        this.inputNodes = a;
        this.hiddenNodes = b;
        this.outputNodes = c;
        if (d) {
            this.model = d;
        } else {
            this.model = this.createModel();
        }

    }

    createModel() {
        const model = tf.sequential();
        const hidden = tf.layers.dense({
            units: this.hiddenNodes,
            inputShape: [this.inputNodes],
            activation: 'relu6'
        });
        const output = tf.layers.dense({
            units: this.outputNodes,
            activation: 'tanh'
        })
        model.add(hidden);
        model.add(output);

        return model
    }

    async predict(arr) {
        const xs = tf.tensor2d([arr]);
        const ys = this.model.predict([xs]);
        xs.dispose()
        const outputs = await ys.data();
        ys.dispose()
        return outputs[0]
    }
}