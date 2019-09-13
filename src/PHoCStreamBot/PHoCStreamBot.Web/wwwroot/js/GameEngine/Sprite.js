class Sprite {
    currentFrame = 0;
    lastFrameUpdate = 0;
    xPosition = 0;
    yPosition = 0;

    constructor(frameSheet, fWidth, fHeight, numberFrames, fps) {
        this.frameSheet = frameSheet;
        this.fWidth = fWidth;
        this.fHeight = fHeight;
        this.numberFrames = numberFrames;
        this.fps = fps;
        this.frameTime = 1000 / fps;
        this.sheetWidth = frameSheet.width;
        this.sheetHeight = frameSheet.height;
    }

    setPosition(x, y) {
        this.xPosition = x;
        this.yPosition = y;
    }

    update(frame) {
        if (frame.progress - this.lastFrameUpdate < this.frameTime) {
            return;
        }

        this.lastFrameUpdate = frame.progress;
        this.currentFrame += 1;
        if (this.currentFrame === this.numberFrames) {
            this.currentFrame = 0;
        }
    }

    render(ctx) {
        ctx.drawImage(this.frameSheet, this.currentFrame * this.fWidth, 0, this.fWidth, this.fHeight, this.xPosition, this.yPosition, this.fWidth, this.fHeight);
    }
}

class Entity {
    constructor(sprite, velocity, width, height) {
        this.sprite = sprite;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
    }

    update(frame) {
        this.sprite.update(frame);
        this.sprite.setPosition(
            this.sprite.xPosition + (this.velocity.x * (frame.diff/1000)),
            this.sprite.yPosition + (this.velocity.y * (frame.diff / 1000)));

        if (this.sprite.xPosition > this.width || this.sprite.xPosition < 0) {
            this.velocity.x = this.velocity.x * -1;
        }

        if (this.sprite.yPosition > this.height || this.sprite.yPosition < 0) {
            this.velocity.y = this.velocity.y * -1;
        }
    }

    render(ctx) {
        this.sprite.render(ctx);
    }
}

class Vector {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}