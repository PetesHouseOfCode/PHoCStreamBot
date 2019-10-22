"use strict";
import messageTypes from "./message-types.js";
import PubSub from "./PubSub.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.text1 = null;
    }

    preload() {
        this.load.image('blue', '/Images/Sprites/bluestar.png');
        //this.load.spritesheet('smoke', '/Images/Sprites/Smoke15Frames.png', { frameWidth: 256, frameHeight: 256 });
        this.load.image('pete-cyclops', '/Images/CyclopsPete-small.png');
        this.load.image('pete-cyclops-fade', '/Images/CyclopsPete-small-fade.png');
    }

    create() {
        PubSub.receive(messageTypes.hiPete, this.hiPete, this);
        PubSub.receive(messageTypes.yell, this.yell, this);

        this.text1 = this.add.text(400, 100, '', { fontSize: "35px" });
        this.text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.graphics = this.add.graphics();
    }

    hiPete(message) {
        const circle = new Phaser.Geom.Circle(1920 / 2, 1080 / 2, 150);
        this.graphics.strokeCircleShape(circle);
        const particles = this.add.particles('pete-cyclops-fade');
        var emitter = particles.createEmitter({
            timeScale: 1,
            bounce: true,
            lifespan: 2000,
            speed: 400,
            //angle: { min: 180, max: 360 },
            scale: { start: .3, end: 1.6 },
            blendMode: 'ADD',
            //x: 1920 / 2,
            //y: 1080 / 2,
            alpha: { start: .9, end: 0 },
            emitZone: { type: 'random', source: circle, quantity: 20 },
            gravityY: 200
        });

        setTimeout(() => {
            emitter.stop();
            this.time.delayedCall(3000, () => {
                particles.destroy();
            });
        }, 5000);
    }

    yell(message, text) {
        this.text1.text = text;
        setTimeout(() => {
            this.text1.text = "";
        }, 3000);
    }
}