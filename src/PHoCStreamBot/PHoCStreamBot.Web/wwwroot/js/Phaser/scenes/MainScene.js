"use strict";
import messageTypes from "../message-types.js";
import RocketContainer from "../RocketContainer.js";
import AlienContainer from "../objects/AlienContainer.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('Main');
        this.text1 = null;
        this.imagesLoaded = [];
        this.rockets = [];
        this.rockets2 = [];
        this.degree = 0.0174533;
        this.aliens = [];

        this.hsv = Phaser.Display.Color.HSVColorWheel();
    }

    init() {
        this.connection = this.sys.game.globals.connection;
        this.pubSub = this.sys.game.globals.pubSub;

        this.connectToEvents();
    }

    connectToEvents() {
        const self = this;
        this.connection.on("ExecuteCommand", function (command) {
            console.debug("Command executed: " + command);
            console.debug(command);

            if (command.commandText.toLowerCase() === "hi_pete") {
                self.hiPete();
                return;
            }

            if (command.commandText === "yell") {
                self.yell(command.args.join(" "));
                return;
            }

            if (command.commandText === "alien") {
                self.alienCommand(command);
                return;
            }
        });

        this.connection.on("ReceiveMessage", function (message) {
            console.debug("Signlr Received: ReceiveMessage");
            console.debug(message);

            if (message.emotes.length > 0) {
                for (let i = 0; i < message.emotes.length; i++) {
                    let args = {
                        id: message.emotes[i].name,
                        url: message.emotes[i].imageUrl
                    };

                    self.popEmote(args);
                }
            }
        });
    }

    preload() {
    }

    create() {
        this.physics.world.setBounds(0, 0, 1920, 1080);

        this.text1 = this.add.text(400, 100, '', { fontSize: "35px" });
        this.text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.graphics = this.add.graphics();

        this.rockets2.push(new RocketContainer(this, 400, 1080, 'test-emote', 'firework-launch-01', 'firework-pop-01', { x: 100, y: -600 }));

        // this.input.on('pointerdown', function (pointer) {
        //     this.launchRocket();
        // }, this);

        this.input.on('pointerdown', function (pointer) {
            this.alienCommand({
                user: {
                    username: 'button',
                    hexcolor: ''
                }
            });
        }, this);

        this.buildAlienWalkAnim('p1_walk', 'p1_alien_walk');
        this.buildAlienWalkAnim('p2_walk', 'p2_alien_walk');
        this.buildAlienWalkAnim('p3_walk', 'p3_alien_walk');
    }

    buildAlienWalkAnim(framePrefix, animKeyName) {
        var frameNames = this.anims.generateFrameNames('aliens', {
            start: 1, end: 11, zeroPad: 2,
            prefix: framePrefix, suffix: '.png'
        });
        this.anims.create({ key: animKeyName, frames: frameNames, frameRate: 16, repeat: -1 });
    }

    update() {
        this.rockets2.forEach((rocket) => { if (rocket.active) this.updateRocket2(rocket); });
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
        if (rocket.length > 0) {
            rocket[0].restart(positionX, 1040, imageKey, { x: velocityX, y: velocityY });
            console.log('restarting existing rocket');
            return;
        }

        this.rockets2.push(new RocketContainer(this, positionX, 1040, imageKey, 'firework-launch-01', 'firework-pop-01', { x: velocityX, y: velocityY }))
    }

    hiPete() {
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

    yell(text) {
        this.text1.text = text;
        setTimeout(() => {
            this.text1.text = "";
        }, 3000);
    }

    alienCommand(command) {
        const self = this;
        if (command.args && command.args.filter(x => x === "invade").length > 0) {
            for (var i = 0; i < 70; i++) {
                setTimeout(() => {
                    self.SetupAlien(command.user.username, command.user.hexColor);
                },
                    Phaser.Math.Between(0, 8000));
            }

            return;
        }

        const userAliens = this.aliens.filter(x => x.username === command.user.username);
        if (userAliens.length <= 0) {
            const tintColorIndex = Phaser.Math.Between(0, 359);
            const y = Phaser.Math.Between(30, 1020);
            const x = Phaser.Math.Between(50, 10);//1870);


            const alienId = Phaser.Math.Between(1, 3);
            const standFrame = `p${alienId}_front.png`;
            const jumpFrame = `p${alienId}_jump.png`;
            const walkAnim = `p${alienId}_alien_walk`;

            this.aliens.push({
                username: command.user.username,
                sprite: new AlienContainer(
                    this,
                    x, y,
                    'aliens',
                    standFrame,
                    jumpFrame,
                    walkAnim,
                    command.user.username,
                    command.user.hexColor || 'white',
                    this.hsv[tintColorIndex].color,
                    true)
            });
        } else {
            const userAlien = userAliens[0];
            let velocityX = 0;
            let velocityY = 0;

            if (command.args.filter(x => x.indexOf("r") >= 0).length > 0) {
                const factor = parseInt(command.args.filter(x => x.indexOf("r") >= 0)[0].replace("r", ""));
                velocityX = 50 * factor;
            }

            if (command.args.filter(x => x.indexOf("l") >= 0).length > 0) {
                const factor = parseInt(command.args.filter(x => x.indexOf("l") >= 0)[0].replace("l", ""));
                velocityX = -50 * factor;
            }

            if (command.args.filter(x => x.indexOf("u") >= 0).length > 0) {
                const factor = parseInt(command.args.filter(x => x.indexOf("u") >= 0)[0].replace("u", ""));
                velocityY = -50 * factor;
            }

            if (command.args.filter(x => x.indexOf("d") >= 0).length > 0) {
                const factor = parseInt(command.args.filter(x => x.indexOf("d") >= 0)[0].replace("d", ""));
                velocityY = 50 * factor;
            }


            if (velocityX !== 0 || velocityY !== 0) {
                userAlien.sprite.body.setVelocity(velocityX, velocityY);
            }
            
            userAlien.sprite.jump();
            setTimeout(() => userAlien.sprite.stand(), 3000);
        }
    }

    SetupAlien(username, hexColor) {
        const tintColorIndex = Phaser.Math.Between(0, 359);
        const y = Phaser.Math.Between(30, 1020);
        const x = Phaser.Math.Between(150, 1770);

        const rightLeft = Phaser.Math.Between(0, 1);
        const keepGoing = Phaser.Math.Between(0, 1);

        const alienId = Phaser.Math.Between(1, 3);
        const standFrame = `p${alienId}_front.png`;
        const jumpFrame = `p${alienId}_jump.png`;
        const walkAnim = `p${alienId}_alien_walk`;

        if (rightLeft === 0) {
            const alien = new AlienContainer(
                this,
                -70, y,
                'aliens',
                standFrame,
                jumpFrame,
                walkAnim,
                username,
                hexColor || 'white',
                this.hsv[tintColorIndex].color);
            alien.walkRight();
            var timeline = this.tweens.timeline({
                targets: alien,
                tweens: [
                    {
                        x: x - 110,
                        duration: 4500,
                        onComplete: () => {
                            alien.stopWalking();
                        }
                    },
                    {
                        x: x,
                        y: y - 30,
                        duration: 500,
                        onStart: () => {
                            alien.jump();
                        },
                        onComplete: () => {
                            alien.stand();
                            alien.setPosition(x, y);
                        }
                    },
                    {
                        x: keepGoing ? 1990 : -100,
                        duration: 5000,
                        onStart: () => {
                            if (keepGoing) {
                                alien.walkRight();
                            } else {
                                alien.walkLeft();
                            }
                        },
                        onComplete: () => {
                            alien.stopWalking();
                            alien.visible = false;
                        },
                        offset: 8000
                    }
                ]
            });
        }
        else {
            const alien = new AlienContainer(
                this,
                1990, y,
                'aliens',
                standFrame,
                jumpFrame,
                walkAnim,
                username,
                hexColor || 'white',
                this.hsv[tintColorIndex].color);
            alien.walkLeft();
            var timeline = this.tweens.timeline({
                targets: alien,
                tweens: [
                    {
                        x: x + 110,
                        duration: 4500,
                        onComplete: () => {
                            alien.stopWalking();
                        }
                    },
                    {
                        x: x,
                        y: y - 30,
                        duration: 500,
                        onStart: () => {
                            alien.jump();
                        },
                        onComplete: () => {
                            alien.stand();
                            alien.setPosition(x, y);
                        }
                    },
                    {
                        x: keepGoing ? -100 : 1990,
                        duration: 5000,
                        onStart: () => {
                            if (keepGoing) {
                                alien.walkLeft();
                            } else {
                                alien.walkRight();
                            }
                        },
                        onComplete: () => {
                            alien.stopWalking();
                            alien.visible = false;
                        },
                        offset: 8000
                    }
                ]
            });
        }
    }

    popEmote(message) {
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
        if (selector > 1) {
            setTimeout(() => { this.launchRocket(imageId); }, this.getRandomValue(1, 500));
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

    getRandomValue(min, max) {
        return Math.floor(min + (Math.random() * (max - min)))
    }
}