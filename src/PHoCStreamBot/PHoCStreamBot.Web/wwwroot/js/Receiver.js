"use strict";

toastr.options.positionClass = 'toast-top-full-width';
toastr.options.newestOnTop = false;
toastr.options.closeDuration = 1500;
var connection = new signalR.HubConnectionBuilder().withUrl("/PHoCStreamBotHub").build();

connection.on("ExecuteCommand", function (command, args) {

    toastr.warning(
        command.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        + " " + args,
        "COMMAND");
});

connection.on("ReceiveMessage", function (message) {
    
    toastr.info(message.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), message.userName);
});

connection.start().then(function () {
   
}).catch(function (err) {
    return console.error(err.toString());
});