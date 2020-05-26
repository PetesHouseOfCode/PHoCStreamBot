const Direction = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
};

export default class AlienContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, standFrame, jumpFrame, walkAnim, name, nameColor, tint) {
    super(scene, x, y);
    this.scene = scene; // the scene this container will be added to
    // this.velocity = 160; // the velocity when moving our player
    // this.currentDirection = Direction.RIGHT;
    this.playerAttacking = false;
    this.flipX = true;
    this.alienKey = key;
    this.standFrame = standFrame;
    this.jumpFrame = jumpFrame;
    this.walkAnim = walkAnim;
    this.name = name;
    this.nameColor = nameColor || 'white';
    this.tint = tint;
    this.yLine = y;

    // set a size on the container
    this.setSize(64, 64);
    // enable physics
    // this.scene.physics.world.enable(this);
    // collide with world bounds
    // this.body.setCollideWorldBounds(true);

    // add the alien container to our existing scene
    this.scene.add.existing(this);
    this.alien = this.scene.add.sprite(0, 0, this.alienKey, this.standFrame);
    this.alien.setOrigin(0, 0);
    this.alien.setTint(tint);
    this.add(this.alien);

    // create the alien name
    this.createNamePlate();
  }

  createNamePlate() {
    this.namePlateShadow = this.scene.add.text(-27, -34, this.name, { fontSize: '14px', color: 'white' });
    this.add(this.namePlateShadow);
    this.namePlate = this.scene.add.text(-28, -35, this.name, { fontSize: '14px', color: this.nameColor });
    this.add(this.namePlate);
  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64 * (this.health / this.maxHealth), 5);
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  respawn(playerObject) {
    this.health = playerObject.health;
    this.setPosition(playerObject.x, playerObject.y);
    this.updateHealthBar();
  }

  walkOn() {
    this.visible = true;
    this.alien.anims.play(this.walkAnim);
    const stopPosition = Phaser.Math.Between(800, 1120);

    if(this.x < 960) {
      this.alien.flipX = false;
      var timeline = this.scene.tweens.timeline({
        targets: this,
        tweens: [
          {
            x: stopPosition - 110,
            duration: 4500,
            onComplete: () => {
              this.alien.anims.stop();
            }
          },
          {
            x: stopPosition,
            y: this.yLine - 30,
            duration: 500,
            onStart: () => {
              this.alien.setTexture(this.alienKey, this.jumpFrame);
            },
            onComplete: () => {
              this.alien.setTexture(this.alienKey, this.standFrame);
              this.setPosition(stopPosition, this.yLine);
            }
          },
          {
            x: -100,
            duration: 5000,
            onStart: () => {
              this.alien.flipX = true;
              this.alien.anims.play(this.walkAnim);
            },
            onComplete: () => {
              this.alien.anims.stop();
              this.visible = false;
            },
            offset: 8000
          }]
      });
    }
    else {
      this.alien.flipX = true;
      var timeline = this.scene.tweens.timeline({
        targets: this,
        tweens: [
          {
            x: stopPosition + 110,
            duration: 4500,
            onComplete: () => {
              this.alien.anims.stop();
            }
          },
          {
            x: stopPosition,
            y: this.yLine - 30,
            duration: 500,
            onStart: () => {
              this.alien.setTexture(this.alienKey, this.jumpFrame);
            },
            onComplete: () => {
              this.alien.setTexture(this.alienKey, this.standFrame);
              this.setPosition(stopPosition, this.yLine);
            }
          },
          {
            x: 2020,
            duration: 5000,
            onStart: () => {
              this.alien.flipX = false;
              this.alien.anims.play(this.walkAnim);
            },
            onComplete: () => {
              this.alien.anims.stop();
              this.visible = false;
            },
            offset: 8000
          }]
      });
    }
  }

  update(cursors) {
  }
}
