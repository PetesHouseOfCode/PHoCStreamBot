class Sprite {
    currentFrame = 0;
    lastFrameUpdate = 0;

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