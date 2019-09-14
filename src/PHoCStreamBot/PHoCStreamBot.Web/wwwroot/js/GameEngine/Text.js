"use strict";

class SpriteText {
    position = Vector.point(0,0);

    constructor(text, font, fillStyle) {
        this.text = text;
        this.font = font;
        this.fillStyle = fillStyle;
    }

    update(frame) {
    }

    setPosition(position){
        this.position = position;
    }
    render(ctx, position) {
        ctx.fillStyle = this.fillStyle;
        ctx.font = this.font;
        ctx.fillText(this.text, this.position.x, this.position.y);
    }
}