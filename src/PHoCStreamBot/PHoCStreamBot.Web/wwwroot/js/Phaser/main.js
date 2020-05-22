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
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('Main', MainScene);
        this.scene.start('Boot');
    }
}

window.game = new Game();

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/PHoCStreamBotHub")
    .build();

connection.on("ExecuteCommand", function (command, args) {
    console.debug("Command executed: " + command);

    if (command.toLowerCase() === "hi_pete") {
        PubSub.dispatch(messageTypes.hiPete);
        return;
    }

    if (command === "yell") {
        PubSub.dispatch(messageTypes.yell, args);
        return;
    }
});

connection.on("ReceiveMessage", function(message){
    console.debug("Signlr Received: ReceiveMessage");
    console.debug(message);
    
    if(message.emotes.length > 0) {
        for(let i = 0; i < message.emotes.length; i++) {
            let args = {
                id: message.emotes[i].name,
                url: message.emotes[i].imageUrl
            };

            PubSub.dispatch(messageTypes.popEmote, args);
        }
    }
});

connection
    .start()
    .catch(function(err) {
        return console.error(err.toString());
    });