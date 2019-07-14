"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/PHoCStreamBotHub").build();

connection.on("ExecuteCommand", function (command, args) {
    var msg = command.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    msg = msg + ":" + args;
    var li = document.createElement("li");
    li.textContent = msg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("ReceiveMessage", function (message) {
    var li = document.createElement("li");
    var userName = document.createElement("span");
    userName.style = "color: " + message.userNameColor;
    userName.textContent = message.userName;
    li.append(userName);
    var messageElement = document.createElement("span");
    messageElement.textContent = ": " + message.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    li.append(messageElement);
    document.getElementById("messagesList").appendChild(li);

    toastr.success(message.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), message.userName);
});

connection.start().then(function () {
   
}).catch(function (err) {
    return console.error(err.toString());
});