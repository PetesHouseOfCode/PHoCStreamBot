"use strict";
import messageTypes from "./message-types.js";
import PubSub from "./PubSub.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super();
        this.text1 = null;
        this.imagesLoaded = [];
        this.rockets = [];
        this.degree = 0.0174533;
    }

    preload() {
        this.load.image('blue', '/Images/Sprites/bluestar.png');
        //this.load.spritesheet('smoke', '/Images/Sprites/Smoke15Frames.png', { frameWidth: 256, frameHeight: 256 });
        this.load.image('pete-cyclops', '/Images/CyclopsPete-small.png');
        this.load.image('pete-cyclops-fade', '/Images/CyclopsPete-small-fade.png');
        this.load.image('test-emote', 'https://static-cdn.jtvnw.net/emoticons/v1/499/1.0');
    }

    create() {
        PubSub.receive(messageTypes.hiPete, this.hiPete, this);
        PubSub.receive(messageTypes.yell, this.yell, this);
        PubSub.receive(messageTypes.popEmote, this.popEmote, this);

        this.text1 = this.add.text(400, 100, '', { fontSize: "35px" });
        this.text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.graphics = this.add.graphics();

        let particle = this.add.particles('test-emote');

        let rocket = {
            item: this.physics.add.image(300, 1080, 'test-emote'),
            particle: particle,
            emitter: particle.createEmitter({
                x: 300, 
                y: 1080,
                lifespan: 500,
                speed: { min: 5, max: 15 },
                scale: { start: .7, end: 0 },
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 1), quantity: 10 },
                gravityY: 100,
            }, this),
            acceleration: new Phaser.Math.Vector2()
        };
        rocket.item.setVelocity(100, -600);
        this.rockets.push(rocket);
    }

    update() {
        this.updateRockets();
    }

    updateRockets() {
        this.rockets.forEach((rocket) => {this.updateRocket(rocket)});
    }

    updateRocket(rocket) {
        if(rocket.item.body.velocity.y > 0) {
            console.log('explode');
            rocket.emitter.setLifespan(3000);
            rocket.emitter.setSpeed({min: 100, max: 150});
            rocket.emitter.setQuantity(100);
            rocket.emitter.setEmitZone({ type: 'edge', source: new Phaser.Geom.Circle(0, 0, 5), quantity: 30 })
            rocket.emitter.explode();
            rocket.item.setVelocity(0,0);
            rocket.item.visible = false;
            rocket.item.body.enable = false;            
        } else {
            rocket.emitter.setPosition(rocket.item.x, rocket.item.y);
        }        
    }

    hiPete(messageType) {
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

    yell(messageType, text) {
        this.text1.text = text;
        setTimeout(() => {
            this.text1.text = "";
        }, 3000);
    }

    popEmote(messageType, message) {
        this.load.on('filecomplete-image-' + message.id, (file) => {
            console.log('loaded image: ' + file);
            this.imagesLoaded.push(file);
            this.createEmoteEffect(file);
        }, this);
        if (this.imagesLoaded.indexOf(message.id) >= 0) {
            console.log('found image: ' + message.id);
            this.createEmoteEffect(message.id);
        } else {
            console.log('missing image: ' + message.id);
            this.load.image(message.id, message.url);
            this.load.start();
        }
    }

    createEmoteEffect(imageId) {
        var particles = this.add.particles(imageId);
        var emitterIndex = Math.floor(Math.random() * this.emitterPositions.length);
        var emitConfig = this.emitterPositions[emitterIndex];
        //var emitConfig = this.emitterPositions[3];
        let emitter2 = particles.createEmitter({
            timeScale: 1,
            bounce: true,
            lifespan: emitConfig.lifespan,
            speed: emitConfig.speed,
            angle: emitConfig.angle,
            scale: emitConfig.scale,
            blendMode: emitConfig.blendMode,
            x: emitConfig.x,
            y: emitConfig.y,
            emitZone: emitConfig.emitZone,
            gravityY: emitConfig.gravityY,
            rotate: { min: -30, max: 30 },
            quantity: emitConfig.quantity
        }, this);

        var timeout = Math.floor(2000 + (Math.random() * 3000))
        setTimeout(() => {
            emitter2.stop();
            this.load.off('filecomplete-image-' + imageId);
        }, timeout);
    }

    emitterPositions = [
        {
            blendMode: 'ADD',
            lifespan: 3000,
            speed: {min: 300, max: 800 },
            scale: { start: 1.5, end: 0 },
            x: 300,
            y: 1080,
            angle: {min: 265, max: 275},
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 50), quantity: 1 },
            gravityY: 800
        },
        {
            blendMode: 'SCREEN',
            lifespan: 500,
            speed: {min: -100, max: 100},
            scale: { start: 1, end: 0 },
            x: 1780,
            y: 110,
            emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-220, -100, 320, 200), quantity: 25 },
            gravityY: 200
        },
        {
            blendMode: 'SCREEN',
            lifespan: 500,
            speed: {min: -100, max: 100},
            scale: { start: 1, end: 0 },
            x: 1780,
            y: 110,
            emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-220, -100, 320, 200), quantity: 25 },
            quantity: 8,
            gravityY: 200
        },
        {
            blendMode: 'SCREEN',
            lifespan: 500,
            speed: {min: -100, max: 100},
            scale: { start: 1, end: 0 },
            x: 270,
            y: 110,
            emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-240, -100, 340, 200), quantity: 25 },
            quantity: 8,
            gravityY: 200
        },
        {
            blendMode: 'SCREEN',
            lifespan: 500,
            speed: {min: -100, max: 100},
            scale: { start: 1, end: 0 },
            x: 1920 / 2,
            y: 1080 / 2,
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 200), quantity: 25 },
            quantity: 8,
            gravityY: 200
        },
    ];
}