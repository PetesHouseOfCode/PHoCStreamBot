export default class AlienContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, standFrame, jumpFrame, walkAnim, name, nameColor, alienColor) {
        super(scene, x, y);
        this.scene = scene;

        this.key = key;
        this.standFrame = standFrame;
        this.jumpFrame = jumpFrame;
        this.walkAnim = walkAnim;
        this.name = name;
        this.nameColor = nameColor;
        this.alienColor = alienColor;

        this.scene.add.existing(this);
        this.alien = this.scene.add.sprite(0, 0, key, standFrame);
        this.alien.setOrigin(0, 0);
        this.alien.setTint(alienColor);
        
        this.add(this.alien);
        this.createNamePlate();
    }

    createNamePlate() {
        this.namePlate = this.scene.add.text(-30, -18, this.name, { fontSize: '16px', color: this.nameColor });
        this.add(this.namePlate);
    }

    walkRight() {
        this.alien.flipX = false;
        this.alien.anims.play(this.walkAnim);
    }

    walkLeft() {
        this.alien.flipX = true;
        this.alien.anims.play(this.walkAnim);
    }

    stopWalking() {
        this.alien.anims.stop();
    }

    jump() {
        this.alien.setTexture(this.key, this.jumpFrame);
    }

    stand() {
        this.alien.setTexture(this.key, this.standFrame);
    }
}