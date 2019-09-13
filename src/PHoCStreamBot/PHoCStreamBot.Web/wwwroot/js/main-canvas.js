"use strict";

(function () {
    let canvas = document.getElementById('screen');

    var connection = new signalR.HubConnectionBuilder().withUrl("/PHoCStreamBotHub").build();

    connection.on("ExecuteCommand", function (command, args) {
        console.debug('Command executed: ' + command);

        if (command.toLowerCase() === 'hi_pete') {

            MyGame.sprites.push(new Text("HI PETE!!!!!!!!", 800, 500));
            setTimeout(() => { MyGame.sprites.pop(); }, 5000);
            playAudio('/sounds/sup.m4a');
            return;
        }

        if (command === 'yell') {

            MyGame.sprites.push(new Text(args, 800, 400));
            setTimeout(() => { MyGame.sprites.pop(); }, 5000);
            return;
        }
    });

    function main(tFrame) {
        MyGame.stopMain = window.requestAnimationFrame(main);

        MyGame.diff = tFrame - MyGame.progress;
        MyGame.progress = tFrame;

        var ctx = document.getElementById('screen').getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        update({
            progress: MyGame.progress,
            diff: MyGame.diff
        });
        render(ctx);
    }

    function update(frame) {
        MyGame.sprites.forEach((sprite) => sprite.update(frame));
    }

    function render(ctx) {
        MyGame.sprites.forEach((sprite) => sprite.render(ctx));
    }
    
    function playAudio(src) {
        let media = new Audio(src);
        const playPromise = media.play();
        if (playPromise !== null) {
            playPromise.catch(() => { });
        }
        return media;
    }

    var image = new Image();
    image.src = "/Images/Sprites/PeteHouseOfCode.png";
    let logo = new Sprite(image, 128, 128, 2, 5);
    logo.setPosition(300, 10);
    MyGame.sprites.push(logo);

    var megaImage = new Image();
    megaImage.src = "/Images/Sprites/MegamanPush.png";
    let megaSprite = new Sprite(megaImage, 124, 112, 3, 9);
    megaSprite.setPosition(0, 0);
    MyGame.sprites.push(megaSprite);

    var adventureImage = new Image();
    adventureImage.src = "/Images/Sprites/adventurer-idle-2.png";

    let adventureSprite = new Sprite(adventureImage, 100, 74, 4, 12);
    adventureSprite.setPosition(100, 200);
    MyGame.sprites.push(adventureSprite);


    let adventureSprite2 = new Sprite(adventureImage, 100, 74, 4, 4);
    adventureSprite2.setPosition(100, 280);
    MyGame.sprites.push(adventureSprite2);

    MyGame.sprites.push(new Text("Test Font", 10, 500));

    let e1 = new Entity(adventureSprite, new Vector(100, -50), canvas.width, canvas.height);
    MyGame.sprites.push(e1);

    connection.start().then(function () {
        MyGame.progress = performance.now(); 
        main(performance.now());
    }).catch(function (err) {
        return console.error(err.toString());
    });
})();