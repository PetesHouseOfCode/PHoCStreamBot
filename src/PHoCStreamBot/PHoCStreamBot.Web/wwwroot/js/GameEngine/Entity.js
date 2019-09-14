"use strict";

class Entity {
    constructor(sprite, position, velocity, width, height) {
        this.sprite = sprite;
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
    }
    
    update(frame) {
        this.sprite.update(frame);
        this.position.x + (this.velocity.x * (frame.diff / 1000));
        this.position.y + (this.velocity.y * (frame.diff / 1000));
        this.sprite.setPosition(this.position);
        if (this.position.x > this.width || this.position.x < 0) {
            this.velocity.x = this.velocity.x * -1;
        }
        if (this.position.y > this.height || this.position.y < 0) {
            this.velocity.y = this.velocity.y * -1;
        }
    }

    render(ctx) {
        this.sprite.render(ctx);
    }
}
