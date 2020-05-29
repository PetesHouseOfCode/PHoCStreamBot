﻿"use strict";
import messageTypes from "../message-types.js";
import PubSub from "../PubSub.js";
import RocketContainer from "../RocketContainer.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('Main');
        this.text1 = null;
        this.imagesLoaded = [];
        this.rockets = [];
        this.rockets2 = [];
        this.degree = 0.0174533;
    }

    preload() {
    }

    create() {
        PubSub.receive(messageTypes.hiPete, this.hiPete, this);
        PubSub.receive(messageTypes.yell, this.yell, this);
        PubSub.receive(messageTypes.popEmote, this.popEmote, this);
        PubSub.receive(messageTypes.alien, this.alienCommand, this);
        
        this.physics.world.setBounds(0, 0, 1920, 1080);

        this.text1 = this.add.text(400, 100, '', { fontSize: "35px" });
        this.text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.graphics = this.add.graphics();
        
        this.rockets2.push(new RocketContainer(this, 400, 1080, 'test-emote', 'firework-launch-01', 'firework-pop-01', { x: 100, y: -600 }));

        // this.input.on('pointerdown', function (pointer) {
        //     this.launchRocket();
        // }, this);

        this.alien = this.add.sprite(-100, 410, 'aliens', 'p1_walk01.png');
        this.alien.setOrigin(0,0);

        var frameNames = this.anims.generateFrameNames('aliens', {
                             start: 1, end: 11, zeroPad: 2,
                             prefix: 'p1_walk', suffix: '.png'
                         });

        console.log(frameNames);
        
        this.anims.create({ key: 'walk', frames: frameNames, frameRate: 16, repeat: -1 });
    }

    update() {
        this.rockets2.forEach((rocket) => { if(rocket.active) this.updateRocket2(rocket); });
    }

    updateRocket2(rocket) {
        if (rocket.body.velocity.y > 100) {
            rocket.explode();
        }
    }

    launchRocket(imageKey) {
        imageKey = imageKey || 'test-emote';
        let positionX = this.getRandomValue(50, 1870);
        let velocityX = this.getRandomValue(-300, 300);
        let velocityY = this.getRandomValue(-300, -650);

        let rocket = this.rockets2.filter((rocket) => !rocket.active);
        if(rocket.length > 0)
        {
            rocket[0].restart(positionX, 1040, imageKey, {x: velocityX, y:velocityY});
            console.log('restarting existing rocket');
            return;
        }

        this.rockets2.push(new RocketContainer(this, positionX, 1040, imageKey, 'firework-launch-01', 'firework-pop-01', { x: velocityX, y: velocityY }))
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

    alienCommand(messageType, args) {
        this.alien.visible = true;
        this.alien.flipX = false;
        this.alien.anims.play('walk');

        var timeline = this.tweens.timeline({
            targets: this.alien,
            tweens: [
                {
                    x: 850,
                    duration: 4500,
                    onComplete: () => {
                        this.alien.anims.stop();
                    }
                },
                {
                    x: 960,
                    y: 380,
                    duration: 500,
                    onStart: () => {
                        this.alien.setTexture('aliens', 'p1_jump.png');
                    },
                    onComplete: () => {
                        this.alien.setTexture('aliens', 'p1_front.png');
                        this.alien.setPosition(960, 410);
                    }
                },
                {
                    x: -100,
                    duration: 5000,
                    onStart: () => {
                        this.alien.flipX = true;
                        this.alien.anims.play('walk');
                    },
                    onComplete: () => {
                        this.alien.anims.stop();
                        this.alien.visible = false;
                    },
                    offset: 8000
                }]
        });
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
        let selector = this.getRandomValue(0, 20);
        console.log(`RandomEmotEffect value ${selector}`);
        if(selector > 1) {
            setTimeout(() => {this.launchRocket(imageId);}, this.getRandomValue(1,500));
        } else {
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
    }

    emitterPositions = [
        {
            blendMode: 'ADD',
            lifespan: 3000,
            speed: { min: 300, max: 800 },
            scale: { start: 1.5, end: 0 },
            x: 200,
            y: 1080,
            angle: { min: 265, max: 275 },
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 50), quantity: 1 },
            gravityY: 800
        },
        {
            blendMode: 'ADD',
            lifespan: 3000,
            speed: { min: 300, max: 800 },
            scale: { start: 1.5, end: 0 },
            x: 1720,
            y: 1080,
            angle: { min: 265, max: 275 },
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 50), quantity: 1 },
            gravityY: 800
        },
        // {
        //     blendMode: 'SCREEN',
        //     lifespan: 500,
        //     speed: { min: -100, max: 100 },
        //     scale: { start: 1, end: 0 },
        //     x: 1780,
        //     y: 110,
        //     emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-220, -100, 320, 200), quantity: 25 },
        //     gravityY: 200
        // },
        // {
        //     blendMode: 'SCREEN',
        //     lifespan: 500,
        //     speed: { min: -100, max: 100 },
        //     scale: { start: 1, end: 0 },
        //     x: 1780,
        //     y: 110,
        //     emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-220, -100, 320, 200), quantity: 25 },
        //     quantity: 8,
        //     gravityY: 200
        // },
        // {
        //     blendMode: 'SCREEN',
        //     lifespan: 500,
        //     speed: { min: -100, max: 100 },
        //     scale: { start: 1, end: 0 },
        //     x: 270,
        //     y: 110,
        //     emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-240, -100, 340, 200), quantity: 25 },
        //     quantity: 8,
        //     gravityY: 200
        // },
        // {
        //     blendMode: 'SCREEN',
        //     lifespan: 500,
        //     speed: { min: -100, max: 100 },
        //     scale: { start: 1, end: 0 },
        //     x: 1920 / 2,
        //     y: 1080 / 2,
        //     emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 200), quantity: 25 },
        //     quantity: 8,
        //     gravityY: 200
        // },
    ];

    getRandomValue(min, max)
    {
        return Math.floor(min + (Math.random() * (max - min)))
    }
}