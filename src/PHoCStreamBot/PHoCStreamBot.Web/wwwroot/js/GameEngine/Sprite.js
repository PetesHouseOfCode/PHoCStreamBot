"use strict";

class Sprite {
    position = Vector.zero;

    constructor(animations, startingPosition) {
        this.animations = animations;
        this.currentAnimation = animations[0];
        this.position = startingPosition || Vector.zero;
    }

    setAnimation(name) {

    }

    setPosition(position) {
        this.position = position;
    }

    update(frame) {
        this.currentAnimation.updateFrame(frame);
    }

    render(ctx, position) {
        this.currentAnimation.render(ctx, position || this.position);
    }
}