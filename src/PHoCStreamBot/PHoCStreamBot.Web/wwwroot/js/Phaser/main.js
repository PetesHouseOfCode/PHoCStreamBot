"use strict";
import loadingScene from "./loadingscene.js";

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    },
    transparent: true
};

var game = new Phaser.Game(config);
var emitter;

function preload ()
{
    this.load.image('blue', '/Images/Sprites/bluestar.png');

    //this.load.setBaseURL('');
console.log(loadingScene);
    //this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
    this.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');
    //this.load.spritesheet('smoke', '/Images/Sprites/Smoke15Frames.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('pete-cyclops', '/Images/CyclopsPete-small.png');
    this.load.image('pete-cyclops-fade', '/Images/CyclopsPete-small-fade.png');

}

function create ()
{
    //this.add.image(400, 300, 'sky');
    //var logo = this.physics.add.image(400, 100, 'logo');
    //logo.setVelocity(0, 0);
    //logo.setBounce(1, 1);
    //logo.setCollideWorldBounds(true);
    //emitter.startFollow(logo);
    var circle = new Phaser.Geom.Circle(0, 0, 150);

    var particles = game.scene.scenes[0].add.particles('pete-cyclops-fade');

        emitter = particles.createEmitter({
            timeScale: 1,
            bounce: true,
            lifespan: 5000,
            speed: 400,
            //angle: { min: 180, max: 360 },
            scale: { start: .9, end: 0 },
            blendMode:'ADD',
            x: 1920/2,
            y: 1080/2,
            emitZone: { type: 'random', source: circle, quantity: 20 },
            gravityY: 200
        });

        emitter.stop();
        // emitter.start();
        // setTimeout(() => {
        //     emitter.stop();
        // }, 5000);
}

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/PHoCStreamBotHub")
    .build();

connection.on("ExecuteCommand", function(command, args) {
    console.debug("Command executed: " + command);

    if (command.toLowerCase() === "hi_pete") {
        emitter.start();
        setTimeout(() => {
            emitter.stop();
        }, 5000);
        return;
    }

    if (command === "yell") {
       
        return;
    }
});


connection
    .start()
    .catch(function(err) {
        return console.error(err.toString());
    });