export default class RocketContainers extends Phaser.GameObjects.Container {
  constructor(scene, x, y, imageKey, launchKey, popKey, velocity) {
    super(scene, x, y)
    this.imageKey = imageKey;
    this.velocity = velocity;

    let imageData = this.scene.textures.get(imageKey).getSourceImage();
    this.setSize(imageData.width, imageData.height);
    this.scene.add.existing(this);
    // enable physics
    this.scene.physics.world.enable(this);


    this.circle =  new Phaser.Geom.Circle(0, 0, 1);
    this.explodeShape = new Phaser.Geom.Triangle(-50, 0, 0, -50, 50, 50);
    // this.explodeShape = new Phaser.Geom.Rectangle(-220, -100, 320, 200);
    // Phaser.Geom.Triangle.Rotate(this.explodeShape, 25);

    this.particle = this.scene.add.particles(this.imageKey);
    this.emitter = this.particle
      .createEmitter({
        x: 0,
        y: 0,
        lifespan: 500,
        speed: { min: 5, max: 15 },
        scale: { start: .7, end: 0 },
        emitZone: { type: 'edge', source: this.circle, quantity: 10 },
        gravityY: 100,
      }, this);

    //this.scene.add.existing(this.particle);
    this.launchSound = this.scene.sound.add(launchKey);
    this.popSound = this.scene.sound.add(popKey);

    this.rocket = this.scene.add.image(0, 0, this.imageKey);
    this.add(this.rocket);

    this.emitter.startFollow(this);
    this.body.setVelocity(this.velocity.x, this.velocity.y);
    this.launchSound.play();
  }

  explode() {
    console.log('explode2');
    this.emitter.setLifespan(3000);
    this.emitter.setSpeed({ min: 150, max: 200 });
    this.emitter.setQuantity(100);
    this.emitter.setQuantity(50);
    // this.emitter.setEmitZone({ type: 'edge', source: this.explodeShape, quantity: 30 })
    this.emitter.explode();
    this.body.setVelocity(0, 0);
    this.visible = false;
    this.body.enable = false;
    this.active = false;
    this.popSound.play();
  }

  restart(x, y, imageKey, velocity) {
    this.body.x = x;
    this.body.y = y;
    this.imageKey = imageKey;
    this.velocity = velocity;

    this.body.setVelocity(this.velocity.x, this.velocity.y);
    this.emitter.setLifespan(500);
    this.emitter.setSpeed({min: 10, max: 15});
    this.emitter.setEmitZone({ type: 'edge', source: this.circle, quantity: 10 });
    this.emitter.setQuantity(8);
    this.emitter.start();
    this.visible = true;
    this.body.enable = true;
    this.active = true;
    this.launchSound.play();
  }
}