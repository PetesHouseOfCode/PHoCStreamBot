"use strict";
import messageTypes from "./message-types.js";
import PubSub from "./PubSub.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.emitter = null;
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

        const circle = new Phaser.Geom.Circle(0, 0, 150);

        const particles = this.add.particles('pete-cyclops-fade');

        this.emitter = particles.createEmitter({
            timeScale: 1,
            bounce: true,
            lifespan: 5000,
            speed: 400,
            //angle: { min: 180, max: 360 },
            scale: { start: .9, end: 0 },
            blendMode: 'ADD',
            x: 1920 / 2,
            y: 1080 / 2,
            emitZone: { type: 'random', source: circle, quantity: 20 },
            gravityY: 200
        });

        this.emitter.stop();
    }

    hiPete(message) {
        this.emitter.start();
        setTimeout(() => {
            this.emitter.stop();
        }, 5000);
    }

    yell(message, text) {
        this.text1.text = text;
        setTimeout(() => {
            this.text1.text = "";
        }, 3000);
    }
}