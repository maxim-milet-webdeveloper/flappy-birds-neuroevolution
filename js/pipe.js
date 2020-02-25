class Pipe {
    constructor(bottomY, topY) {
        this.x = canvas.width;
        this.bottomY = bottomY;
        this.topY = topY;
        this.width = 70;
        this.color = 'black';
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, 0)
        ctx.rect(this.x, -1, this.width, this.bottomY + 1);
        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x, this.topY)
        ctx.rect(this.x, this.topY, this.width, canvas.height - this.topY + 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    update() {
        this.x -= 3
    }

    offscreen() {
        return (this.x + 70 + this.width <= 0)
    }
}