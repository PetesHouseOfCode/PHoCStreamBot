"use strict";

class SpriteSheet {
    name = "";
    image = new Image();
    numColumns = 1;
    cellSize = Vector.point(256, 256);

    constructor(name, image, numColumns, cellSize) {
        this.name = name;
        this.image = image;
        this.numColumns = numColumns;
        this.cellSize = cellSize;
        Object.freeze(this);
    }

    static single(name, image, cellSize) {
        return new SpriteSheet(name, image, 1, cellSize || Vector.point(image.width, image.height));
    }

    static singleRow(name, image, numColumns, cellSize) {
        return new SpriteSheet(name, image, numColumns, cellSize || Vector.point(Math.floor(image.width / numColumns), image.height));
    }
}

class SpriteAnimation {
    /**
     * 
     * @param {string} name 
     * @param {SpriteSheet} spriteSheet 
     * @param {number} startFrame 
     * @param {number} numFrames 
     * @param {number} frameRate 
     */
    constructor(name, spriteSheet, startFrame, numFrames, frameRate) {
        this.name = name;
        this.spriteSheet = spriteSheet;
        this.startFrame = startFrame;
        this.numFrames = numFrames;
        this.frameRate = frameRate;
        Object.freeze(this);
    }

    getWidthOffset(frameIndex) {
        let sheetFrameIndex = this.startFrame + frameIndex;
        let index = sheetFrameIndex % this.spriteSheet.numColumns;
        return index * this.spriteSheet.cellSize.x;
    }

    getHeightOffset(frameIndex) {
        let sheetFrameIndex = this.startFrame + frameIndex;
        let index = Math.floor(sheetFrameIndex / this.spriteSheet.numColumns);
        return index * this.spriteSheet.cellSize.y;
    }

    getFrameWidth() {
        return this.spriteSheet.cellSize.x;
    }

    getFrameHeight() {
        return this.spriteSheet.cellSize.y;
    }

    static singleFrame(name, spriteSheet) {
        return new SpriteAnimation(name, spriteSheet, 0, 1, 0);
    }

    static single(name, spriteSheet, numFrames, frameRate) {
        return new SpriteAnimation(name, spriteSheet, 0, numFrames, frameRate);
    }
}