"use strict";

(function () {
    function main(tFrame) {
        MyGame.stopMain = window.requestAnimationFrame(main);

        MyGame.diff = tFrame - MyGame.progress;
        MyGame.progress = tFrame;
        console.log(MyGame.diff);

        var ctx = document.getElementById('screen').getContext('2d');

        update({
            progress: progress,
            diff: diff
        });
        render(ctx);
    }

    function update(frame) {
    }

    function render(ctx) {
    }

    MyGame.lastTick = performance.now();
    MyGame.lastRender = MyGame.lastTick;
    
    main(performance.now());
})();