"use strict";

class SpriteAnimation {
    name = "";
    startFrame = 0;
    currentFrame = 0;
    lastFrameUpdate = 0;

    constructor(name, image, startFrame, numFrames, frameWidth, frameHeight, numColumns, frameRate, scale) {
        this.name = name;
        this.image = image;
        this.startFrame = startFrame;
        this.numFrames = numFrames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.numColumns = numColumns;
        this.frameRate = frameRate;
        this.scale = scale || 1;
    }

    updateFrame(frame) {
        if (this.lastFrameUpdate === 0) {
            this.lastFrameUpdate = frame.progress;
            return;
        }

        let timeDiff = frame.progress - this.lastFrameUpdate;
        let frameTime = 1000 / this.frameRate;
        let numFramesPassed = Math.floor(timeDiff / frameTime);
        if (numFramesPassed > 0) {
            this.currentFrame = (this.currentFrame + numFramesPassed) % this.numFrames;
            this.lastFrameUpdate = frame.progress;
        }
    }

    render(ctx, position) {
        let sheetFrameIndex = this.startFrame + this.currentFrame;
        ctx.drawImage(
            this.image,
            sheetFrameIndex % this.numColumns * this.frameWidth,
            Math.floor(sheetFrameIndex / this.numColumns) * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            position.x,
            position.y,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale);

    }

    static singleFrame(name, image, frameWidth, frameHeight, scale) {
        return new SpriteAnimation(name, image, 1, frameWidth, frameHeight, 1, 0, scale);
    }

    static singleRow(image, numFrames, frameRate, scale) {
        return new SpriteAnimation("default", image, 0, numFrames, Math.floor(image.width / numFrames), image.height, numFrames, frameRate, scale);
    }

    static singleRow(image, numFrames, frameRate, scale) {
        return new SpriteAnimation("default", image, 0, numFrames, Math.floor(image.width / numFrames), image.height, numFrames, frameRate, scale);
    }
}