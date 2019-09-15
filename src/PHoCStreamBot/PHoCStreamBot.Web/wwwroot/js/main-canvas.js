"use strict";

(function () {
    let canvas = document.getElementById('screen');

    var connection = new signalR.HubConnectionBuilder().withUrl("/PHoCStreamBotHub").build();

    connection.on("ExecuteCommand", function (command, args) {
        console.debug('Command executed: ' + command);

        if (command.toLowerCase() === 'hi_pete') {

            MyGame.worldObjects.push(new Text("HI PETE!!!!!!!!", 800, 500));
            setTimeout(() => { MyGame.worldObjects.pop(); }, 5000);
            return;
        }

        if (command === 'yell') {

            MyGame.worldObjects.push(new Text(args, 800, 400));
            setTimeout(() => { MyGame.worldObjects.pop(); }, 5000);
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
            diff: MyGame.diff,
            secondsPassed: MyGame.diff / 1000
        });
        render(ctx);
    }

    function update(frame) {
        MyGame.worldObjects.forEach((sprite) => sprite.update(frame));
    }

    function render(ctx) {
        MyGame.worldObjects.forEach((sprite) => sprite.render(ctx));
    }

    var image = new Image();
    image.addEventListener("load",
        () => {
            let a = SpriteAnimation.singleRow(image, 2, 6);
            let logo = new Sprite([a], new Vector(300, 10));
            MyGame.worldObjects.push(logo);
        },
        false);
    image.src = "/Images/Sprites/PeteHouseOfCode.png";

    let smokeImage = new Image();
    smokeImage.addEventListener("load",
        () => {
            let smoke = new SpriteAnimation(
                "idle1",
                smokeImage,
                0,
                15,
                256,
                256,
                5,
                15,
                1);
            MyGame.worldObjects.push(new Emitter("first", Vector.point(500, 400), 10, Vector.point(-10, 4), new Sprite([smoke])));
            MyGame.worldObjects.push(new Sprite([smoke], Vector.point(500, 0)));
        },
        false);
    smokeImage.src = "/Images/Sprites/Smoke15Frames.png";

    var megaImage = new Image();
    megaImage.addEventListener("load",
        () => {
            let a = SpriteAnimation.singleRow(megaImage, 3, 6);
            MyGame.worldObjects.push(new Sprite([a], Vector.point(0, 50)));
        },
        false);
    megaImage.src = "/Images/Sprites/MegamanPush.png";

    var adventureImage = new Image();
    adventureImage.addEventListener("load",
        () => {
            let idle1 = new SpriteAnimation(
                "idle1",
                adventureImage,
                0,
                4,
                50,
                37,
                7,
                7,
                1.5);
            let jumpFlip = new SpriteAnimation(
                "jumpFlip",
                adventureImage,
                14,
                7,
                50,
                37,
                7,
                7,
                2);
            let jumpUp = new SpriteAnimation(
                "jumpUp",
                adventureImage,
                29,
                8,
                50,
                37,
                7,
                7,
                3);
            MyGame.worldObjects.push(new Sprite([idle1], Vector.point(100, 200)));
            //MyGame.worldObjects.push(new Sprite([jumpFlip], Vector.point(170, 200)));
            //MyGame.worldObjects.push(new Sprite([jumpUp], Vector.point(240, 200)));
        },
        false);
    adventureImage.src = "/Images/Sprites/adventurer-sheet.png";

    // let adventureSprite = new Sprite(adventureImage, 100, 74, 4, 12);
    // adventureSprite.setPosition(100, 200);
    // MyGame.sprites.push(adventureSprite);


    // let adventureSprite2 = new Sprite(adventureImage, 100, 74, 4, 4);
    // adventureSprite2.setPosition(100, 280);
    // MyGame.sprites.push(adventureSprite2);
    let text = new SpriteText("Just some wild and crazy text", "40px 'Saira Stencil One', cursive", "#FF0000");
    let message = new Entity(text, Vector.point(10, 350), new Vector(0, 0), canvas.width, canvas.height);
    MyGame.worldObjects.push(message);

    // let e1 = new Entity(adventureSprite, new Vector(100, -50), canvas.width, canvas.height);
    // MyGame.sprites.push(e1);

    connection.start().then(function () {
        MyGame.progress = performance.now();
        main(performance.now());
    }).catch(function (err) {
        return console.error(err.toString());
    });
})();