"use strict";

class Emitter extends WorldObject {
    constructor(name, position, numParticles, direction, sprite) {
        super();
        this.name = name;
        this.position = position;
        this.numParticles = numParticles;
        this.direction = direction;
        this.sprite = sprite;
        this.particles = [];
    }

    update(frame) {
        if (this.particles.length < this.numParticles) {
            for (let i = this.particles.length; i < this.numParticles; i++) {
                let force = Math.floor(Math.random() * 300) - 100;
                let direction = Math.floor(Math.random() * 180) + 180;
                let vector = Vector.fromPolar(direction, force);
                let acceleration = Vector.fromPolar(90, 0);
                let p = new Particle(this.sprite, acceleration, 0.5);
                p.init({
                    lifeExpectancy: Math.floor(Math.random() * 3000) + 1000,
                    force: vector,
                    startTime: frame.progress,
                    position: this.position
                });
                this.particles.push(p);
            }
        }

        this.particles.forEach((particle, index) => {
            if (particle.expired(frame.progress)) {

                let force = Math.floor(Math.random() * 300) - 100;
                let direction = Math.floor(Math.random() * 180) + 180;
                let vector = Vector.fromPolar(direction, force);
                particle.init({
                    lifeExpectancy: Math.floor(Math.random() * 3000) + 1000,
                    force: vector,
                    startTime: frame.progress,
                    position: this.position
                });
            }

            particle.update(frame);
        })
    }

    render(ctx) {
        this.particles.forEach((particle) => {
            particle.render(ctx);
        });
    }
}

class Particle {
    position = Vector.point(0, 0);

    constructor(sprite, acceleration, opacity) {
        this.sprite = sprite;
        this.acceleration = acceleration;
        this.opacity = opacity || 1.0;
    }

    /**
     * 
     * @param options options for initialization
     * @param {number} options.lifeExpectancy 
     * @param {vector} options.force
     * @param {number} options.startTime
     * @param {Vector} options.position
     */
    init(options) {
        this.lifeExpectancy = options.lifeExpectancy;
        this.velocity = options.force;
        this.startTime = options.startTime;
        this.position = options.position;
    }

    expired(now) {
        return this.lifeExpectancy < now - this.startTime;
    }

    update(frame) {
        let newX = this.position.x + (this.velocity.x * frame.secondsPassed);
        let newY = this.position.y + (this.velocity.y * frame.secondsPassed);
        let newVelocityX = this.velocity.x + (this.acceleration.x * frame.secondsPassed);
        let newVelocityY = this.velocity.y + (this.acceleration.y * frame.secondsPassed);
        this.position = new Vector(newX, newY);
        this.velocity = new Vector(newVelocityX, newVelocityY);
        this.sprite.update(frame);
    }

    render(ctx) {
        ctx.globalAlpha = this.opacity;
        this.sprite.setPosition(this.position);
        this.sprite.render(ctx, this.position);
        ctx.globalAlpha = 1.0;
    }
}