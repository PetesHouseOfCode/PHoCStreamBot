"use strict";

toastr.options.positionClass = 'toast-top-full-width';
toastr.options.newestOnTop = false;
toastr.options.closeDuration = 1500;
var connection = new signalR.HubConnectionBuilder().withUrl("/PHoCStreamBotHub").build();

connection.on("ExecuteCommand", function (command, args) {

    if (command.toLowerCase() === 'hi_pete') {
        $("#hiPete").fadeIn(600).delay(800).fadeOut(600);
        playAudio('sounds/sup.m4a');
        return;
    }

    if (command === 'yell') {
        $("#bigBanner").text(args);
        $("#bigBanner").fadeIn(300).delay(700).fadeOut(1000);
        return;
    }

    //toastr.warning(
    //    command.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    //    + " " + args,
    //    "COMMAND");
});

function playAudio(src) {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', src);
    audioElement.play();
}

connection.on("ReceiveMessage", function (message) {
    
    toastr.info(message.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), message.userName);

});

connection.start().then(function () {
   
}).catch(function (err) {
    return console.error(err.toString());
});