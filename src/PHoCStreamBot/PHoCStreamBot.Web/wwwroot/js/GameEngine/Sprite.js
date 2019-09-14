"use strict";

class Sprite {
    position = Vector.point(0, 0);

    constructor(animations, startingPosition) {
        this.animations = animations;
        this.currentAnimation = animations[0];
        this.position = startingPosition;
    }

    setAnimation(name) {

    }

    setPosition(position) {
        this.position = position;
    }

    update(frame) {
        this.currentAnimation.updateFrame(frame);
    }

    render(ctx) {
        this.currentAnimation.render(ctx, this.position);
    }
}