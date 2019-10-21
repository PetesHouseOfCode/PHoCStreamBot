"use strict";
import messageTypes from "./message-types.js";
import MainScene from "./main-scene.js";
import PubSub from "./PubSub.js";

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
    scene: MainScene,
    transparent: true
};

var game = new Phaser.Game(config);

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

connection
    .start()
    .catch(function(err) {
        return console.error(err.toString());
    });