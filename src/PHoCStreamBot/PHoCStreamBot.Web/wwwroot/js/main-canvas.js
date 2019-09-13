"use strict";

(function () {
    let canvas = document.getElementById('screen');

    function main(tFrame) {
        MyGame.stopMain = window.requestAnimationFrame(main);

        MyGame.diff = tFrame - MyGame.progress;
        MyGame.progress = tFrame;

        var ctx = document.getElementById('screen').getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    let adventureSprite = new Sprite(adventureImage, 100, 74, 4, 6);
    adventureSprite.setPosition(100, 200);
    MyGame.sprites.push(adventureSprite);

    MyGame.sprites.push(new Text("Test Font", 10, 500));

    MyGame.lastTick = performance.now();
    MyGame.lastRender = MyGame.lastTick;    
    main(performance.now());
})();