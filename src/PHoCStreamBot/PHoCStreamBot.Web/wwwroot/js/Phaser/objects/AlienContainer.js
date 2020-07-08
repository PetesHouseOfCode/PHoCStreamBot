export default class AlienContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, standFrame, jumpFrame, walkAnim, name, nameColor, alienColor, doesCollide) {
        super(scene, x, y);
        this.scene = scene;

        this.key = key;
        this.standFrame = standFrame;
        this.jumpFrame = jumpFrame;
        this.walkAnim = walkAnim;
        this.name = name;
        this.nameColor = nameColor;
        this.alienColor = alienColor;

        // Getting the sprite size to set for container
        // let imageData = this.scene.textures.get(key).getSourceImage();
        let frameInfo = this.scene.textures.get(key).frames[standFrame];
        this.setSize(frameInfo.cutWidth, frameInfo.cutHeight);

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.alien = this.scene.add.sprite(0, 0, key, standFrame);

        if (doesCollide) {
            this.body.setCollideWorldBounds(true);
            this.body.setBounce(.7);
        }

        this.body.setAllowGravity(false);
        this.body.setDrag(50);
        this.alien.setTint(alienColor);

        this.add(this.alien);
        this.createNamePlate();
    }

    createNamePlate() {
        this.namePlate = this.scene.add.text(-38, -65, this.name, { fontSize: '16px', color: this.nameColor });
        this.namePlate.setX((this.namePlate.width / 2) * -1);
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