"use strict";

(function () {
    function main(tFrame) {
        MyGame.stopMain = window.requestAnimationFrame(main);

        var ctx = document.getElementById('screen').getContext('2d');
        update();
        render();
    }

    function update() {
    }

    function render() {
    }

    main(performance.now());
})();