class Text {
    constructor(text, xPosition, yPosition, width) {
        this.text = text;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
    }

    update(frame) {

    }

    render(ctx) {
        ctx.fillStyle = "#FF0000";
        ctx.font = "40px 'Saira Stencil One', cursive";
        ctx.fillText(this.text, this.xPosition, this.yPosition);
    }
}