"use strict";
import config from "./config/Config.js";
import messageTypes from "./message-types.js";
import BootScene from "./scenes/Boot.js";
import PreloaderScene from "./scenes/PreloaderScene.js";
import MainScene from "./scenes/MainScene.js";
import PubSub from "./PubSub.js";

class Game extends Phaser.Game {
    constructor(){
        super(config);
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/PHoCStreamBotHub")
            .build();
        connection
            .start()
            .catch(function(err) {
                return console.error(err.toString());
            });
        this.globals = {
            connection: connection,
            pubSub: PubSub
        };
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('Main', MainScene);
        this.scene.start('Boot');
    }
}

window.game = new Game();