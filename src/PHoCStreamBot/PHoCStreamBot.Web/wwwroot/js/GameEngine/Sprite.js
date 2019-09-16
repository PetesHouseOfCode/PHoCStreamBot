"use strict";

class Sprite {
    currentFrame = 0;
    lastFrameUpdate = 0;

    /**
     * 
     * @param {SpriteProps} props
     * @param {SpriteAnimation[]} props.spriteAnimations
     * @param {Vector} props.position
     * @param {number} props.scale 
     */
    constructor(props) {
        this.spriteAnimations = props.spriteAnimations;
        this.position = props.position || Vector.point(0, 0);
        this.scale = props.scale || 1;

        this.currentAnimation = this.spriteAnimations[0];
    }

    setAnimation(name) {
        let animation = this.spriteAnimations.find(a => a.name === name);
        if (animation === undefined) {
            console.debug("name not found in animation collection: \"" + name + "\"");
            return;
        }

        this.currentAnimation = animation;
    }

    setPosition(position) {
        this.position = position;
    }

    update(frame) {
        if (this.lastFrameUpdate === 0) {
            this.lastFrameUpdate = frame.progress;
            return;
        }

        let timeDiff = frame.progress - this.lastFrameUpdate;
        let frameTime = 1000 / this.currentAnimation.frameRate;
        let numFramesPassed = Math.floor(timeDiff / frameTime);
        if (numFramesPassed > 0) {
            this.currentFrame = (this.currentFrame + numFramesPassed) % this.currentAnimation.numFrames;
            this.lastFrameUpdate = frame.progress;
        }
    }

    render(ctx) {

        ctx.drawImage(
            this.currentAnimation.spriteSheet.image,
            this.currentAnimation.getWidthOffset(this.currentFrame),
            this.currentAnimation.getHeightOffset(this.currentFrame),
            this.currentAnimation.getFrameWidth(),
            this.currentAnimation.getFrameHeight(),
            this.position.x,
            this.position.y,
            this.currentAnimation.getFrameWidth() * this.scale,
            this.currentAnimation.getFrameHeight() * this.scale);
    }
}