export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image('blue', '/Images/Sprites/bluestar.png');
        this.load.image('pete-cyclops', '/Images/CyclopsPete-small.png');
        this.load.image('pete-cyclops-fade', '/Images/CyclopsPete-small-fade.png');
        this.load.image('test-emote', 'https://static-cdn.jtvnw.net/emoticons/v1/499/1.0');
        this.load.audio('firework-launch-01', '/sounds/firework-single-launch-01.wav');
        this.load.audio('firework-pop-01', '/sounds/firework-pop-01.wav');
        this.load.multiatlas('aliens', '/Images/Sprites/aliens.json', '/Images/Sprites');
    }

    create() {
        this.scene.start('Main');
    }
}