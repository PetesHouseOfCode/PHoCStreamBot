"use strict";

(function() {
    let canvas = document.getElementById("screen");
    let ctx = document.getElementById("screen").getContext("2d");
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var connection = new signalR.HubConnectionBuilder()
        .withUrl("/PHoCStreamBotHub")
        .build();

    connection.on("ExecuteCommand", function(command, args) {
        console.debug("Command executed: " + command);

        if (command.toLowerCase() === "hi_pete") {
            MyGame.worldObjects.push(new Text("HI PETE!!!!!!!!", 800, 500));
            setTimeout(() => {
                MyGame.worldObjects.pop();
            }, 5000);
            return;
        }

        if (command === "yell") {
            MyGame.worldObjects.push(new Text(args, 800, 400));
            setTimeout(() => {
                MyGame.worldObjects.pop();
            }, 5000);
            return;
        }
    });

    function main(tFrame) {
        MyGame.stopMain = window.requestAnimationFrame(main);

        MyGame.diff = tFrame - MyGame.progress;
        MyGame.progress = tFrame;

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
        MyGame.worldObjects.forEach(sprite => sprite.update(frame));
    }

    function render(ctx) {
        MyGame.worldObjects.forEach(sprite => sprite.render(ctx));
    }

    function imageLoader(imagePaths, callback) {
        let loadedCount = 0;
        MyGame.images = [];
        for (let x = 0; x < imagePaths.length; x++) {
            let image = { name: imagePaths[x], image: new Image() };
            image.image.addEventListener("load", loaded, false);
            image.image.src = imagePaths[x];
            MyGame.images.push(image);
        }

        function loaded() {
            loadedCount++;
            if (loadedCount === imagePaths.length) {
                callback();
            }
        }
    }

    imageLoader(
        [
            "/Images/Sprites/PeteHouseOfCode.png",
            "/Images/Sprites/anti_gravitys_rainbow__x1_loop.png",
            "/Images/Sprites/sparkling-fireball.png",
            "/Images/Sprites/adventurer-sheet.png",
            "/Images/Sprites/MegamanPush.png",
            "/Images/Sprites/Smoke15Frames.png",
            "/Images/Sprites/sparkling-fireball.png",
            "/Images/Sprites/bluestar.png"
        ],
        () => {
            MyGame.spriteSheets = [];
            MyGame.spriteSheets.push(
                SpriteSheet.singleRow(
                    "phoc-lights",
                    MyGame.images.find(
                        image => image.name === "/Images/Sprites/PeteHouseOfCode.png"
                    ).image,
                    2
                )
            );

            MyGame.spriteSheets.push(
                SpriteSheet.singleRow(
                    "megaman-poke",
                    MyGame.images.find(
                        image => image.name === "/Images/Sprites/MegamanPush.png"
                    ).image,
                    3
                )
            );

            MyGame.spriteSheets.push(
                new SpriteSheet(
                    "smoke1",
                    MyGame.images.find(
                        image => image.name === "/Images/Sprites/Smoke15Frames.png"
                    ).image,
                    5,
                    Vector.point(256, 256)
                )
            );

            MyGame.spriteSheets.push(
                new SpriteSheet(
                    "adventurer",
                    MyGame.images.find(
                        image => image.name === "/Images/Sprites/adventurer-sheet.png"
                    ).image,
                    7,
                    Vector.point(50, 37)
                )
            );

            MyGame.spriteSheets.push(
                SpriteSheet.single(
                    "star",
                    MyGame.images.find(
                        image => image.name === "/Images/Sprites/bluestar.png"
                    ).image,
                    Vector.point(600, 600)
                )
            );

            let flare = SpriteAnimation.single(
                "default",
                MyGame.spriteSheets.find(sheet => sheet.name === "star"),
                1,
                0
            );
            MyGame.worldObjects.push(
                new Emitter(
                    "first",
                    Vector.point(500, 400),
                    40,
                    Vector.point(-10, 4),
                    new Sprite({
                        spriteAnimations: [flare],
                        scale: 0.25
                    })
                )
            );

            let anim = SpriteAnimation.single(
                "default",
                MyGame.spriteSheets.find(sheet => sheet.name === "phoc-lights"),
                2,
                4
            );
            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [anim],
                    position: Vector.point(200, 0),
                    scale: 1.0
                })
            );

            let megamanPoke = SpriteAnimation.single(
                "default",
                MyGame.spriteSheets.find(sheet => sheet.name === "megaman-poke"),
                3,
                6
            );
            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [megamanPoke],
                    position: Vector.point(0, 0),
                    scale: 1.0
                })
            );

            let smoke1 = SpriteAnimation.single(
                "default",
                MyGame.spriteSheets.find(sheet => sheet.name === "smoke1"),
                15,
                15
            );
            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [smoke1],
                    position: Vector.point(400, 0)
                })
            );

            let adventurerIdle = new SpriteAnimation(
                "idle",
                MyGame.spriteSheets.find(sheet => sheet.name === "adventurer"),
                0,
                4,
                12
            );

            let adventurerAttackUp = new SpriteAnimation(
                "attackUp",
                MyGame.spriteSheets.find(sheet => sheet.name === "adventurer"),
                42,
                7,
                12
            );

            let adventurerIdleSword = new SpriteAnimation(
                "idleSword",
                MyGame.spriteSheets.find(sheet => sheet.name === "adventurer"),
                38,
                4,
                12
            );

            let adventurerForwardJump = new SpriteAnimation(
                "forwardJump",
                MyGame.spriteSheets.find(sheet => sheet.name === "adventurer"),
                14,
                9,
                12
            );

            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [adventurerForwardJump],
                    position: Vector.point(0, 200),
                    scale: 2
                })
            );

            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [adventurerIdle],
                    position: Vector.point(100, 200),
                    scale: 2
                })
            );

            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [adventurerAttackUp],
                    position: Vector.point(200, 200),
                    scale: 2
                })
            );

            MyGame.worldObjects.push(
                new Sprite({
                    spriteAnimations: [adventurerIdleSword],
                    position: Vector.point(300, 200),
                    scale: 2
                })
            );
        }
    );

    // var image = new Image();
    // image.addEventListener("load",
    //     () => {
    //         let a = SpriteAnimation.singleRow(image, 2, 6);
    //         let logo = new Sprite([a], new Vector(300, 10));
    //         MyGame.worldObjects.push(logo);
    //     },
    //     false);
    // image.src = "/Images/Sprites/PeteHouseOfCode.png";

    // let smokeImage = new Image();
    // smokeImage.addEventListener("load",
    //     () => {
    //         let smoke = new SpriteAnimation(
    //             "idle1",
    //             smokeImage,
    //             0,
    //             15,
    //             256,
    //             256,
    //             5,
    //             15,
    //             1);
    //         MyGame.worldObjects.push(new Emitter("first", Vector.point(500, 400), 10, Vector.point(-10, 4), new Sprite([smoke])));
    //         MyGame.worldObjects.push(new Sprite([smoke], Vector.point(500, 0)));
    //     },
    //     false);
    // smokeImage.src = "/Images/Sprites/Smoke15Frames.png";

    // let flareImage = new Image();
    // flareImage.addEventListener("load",
    //     () => {
    //         let flare = new SpriteAnimation(
    //             "idle1",
    //             flareImage,
    //             0,
    //             1,
    //             600,
    //             600,
    //             1,
    //             1,
    //             0.4);
    //         MyGame.worldObjects.push(new Emitter("first", Vector.point(500, 400), 40, Vector.point(-10, 4), new Sprite([flare])));
    //         MyGame.worldObjects.push(new Sprite([flare], Vector.point(500, 0)));
    //     },
    //     false);
    // flareImage.src = "/Images/Sprites/bluestar.png";

    // let rainbowImage = new Image();
    // rainbowImage.addEventListener("load",
    //     () => {
    //         let rainbow = new SpriteAnimation(
    //             "default",
    //             rainbowImage,
    //             0,
    //             60,
    //             138,
    //             148,
    //             7,
    //             60,
    //             1);
    //         MyGame.worldObjects.push(new Sprite([rainbow], Vector.point(700, 0)));
    //     },
    //     false);
    // rainbowImage.src = "/Images/Sprites/anti_gravitys_rainbow__x1_loop.png";

    // let sparkImage = new Image();
    // sparkImage.addEventListener("load",
    //     () => {
    //         let spark = new SpriteAnimation(
    //             "default",
    //             sparkImage,
    //             0,
    //             60,
    //             256,
    //             256,
    //             8,
    //             30);
    //         let spark2 = new SpriteAnimation(
    //             "default",
    //             sparkImage,
    //             0,
    //             60,
    //             256,
    //             256,
    //             8,
    //             30);

    //         MyGame.worldObjects.push(new Sprite([spark], Vector.point(900, 0)));
    //         MyGame.worldObjects.push(new Emitter("first", Vector.point(500, 400), 40, Vector.point(-10, 4), new Sprite([spark2])));
    //     },
    //     false);
    // sparkImage.src = "/Images/Sprites/sparkling-fireball.png";

    // var megaImage = new Image();
    // megaImage.addEventListener("load",
    //     () => {
    //         let a = SpriteAnimation.singleRow(megaImage, 3, 6);
    //         MyGame.worldObjects.push(new Sprite([a], Vector.point(0, 50)));
    //     },
    //     false);
    // megaImage.src = "/Images/Sprites/MegamanPush.png";

    // var adventureImage = new Image();
    // adventureImage.addEventListener("load",
    //     () => {
    //         let idle1 = new SpriteAnimation(
    //             "idle1",
    //             adventureImage,
    //             0,
    //             4,
    //             50,
    //             37,
    //             7,
    //             7,
    //             1.5);
    //         let jumpFlip = new SpriteAnimation(
    //             "jumpFlip",
    //             adventureImage,
    //             14,
    //             7,
    //             50,
    //             37,
    //             7,
    //             7,
    //             2);
    //         let jumpUp = new SpriteAnimation(
    //             "jumpUp",
    //             adventureImage,
    //             29,
    //             8,
    //             50,
    //             37,
    //             7,
    //             7,
    //             3);
    //         MyGame.worldObjects.push(new Sprite([idle1], Vector.point(100, 200)));
    //         //MyGame.worldObjects.push(new Sprite([jumpFlip], Vector.point(170, 200)));
    //         //MyGame.worldObjects.push(new Sprite([jumpUp], Vector.point(240, 200)));
    //     },
    //     false);
    // adventureImage.src = "/Images/Sprites/adventurer-sheet.png";

    // let adventureSprite = new Sprite(adventureImage, 100, 74, 4, 12);
    // adventureSprite.setPosition(100, 200);
    // MyGame.sprites.push(adventureSprite);

    // let adventureSprite2 = new Sprite(adventureImage, 100, 74, 4, 4);
    // adventureSprite2.setPosition(100, 280);
    // MyGame.sprites.push(adventureSprite2);
    let text = new SpriteText(
        "Just some wild and crazy text",
        "40px 'Saira Stencil One', cursive",
        "#FF0000"
    );
    let message = new Entity(
        text,
        Vector.point(10, 350),
        new Vector(0, 0),
        canvas.width,
        canvas.height
    );
    MyGame.worldObjects.push(message);

    // let e1 = new Entity(adventureSprite, new Vector(100, -50), canvas.width, canvas.height);
    // MyGame.sprites.push(e1);

    connection
        .start()
        .then(function() {
            MyGame.progress = performance.now();
            main(performance.now());
        })
        .catch(function(err) {
            return console.error(err.toString());
        });
})();