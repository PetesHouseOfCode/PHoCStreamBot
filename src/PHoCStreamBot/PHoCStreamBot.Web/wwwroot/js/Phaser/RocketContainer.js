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

    this.launchSound = this.scene.sound.add(launchKey);
    this.popSound = this.scene.sound.add(popKey);

    this.circle =  new Phaser.Geom.Circle(0, 0, 1);
    this.explodeShape = new Phaser.Geom.Triangle(-50, 0, 0, -50, 50, 50);

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
    this.particle.setDepth(1);

    this.rocket = this.scene.add.image(0, 0, this.imageKey);
    this.setDepth(4);
    this.add(this.rocket);

    this.emitter.startFollow(this);
    this.body.setVelocity(this.velocity.x, this.velocity.y);
    this.body.setBounce(1).setCollideWorldBounds(true);

    this.launchSound.play();
  }

  explode() {
    console.log('explode2');
    this.emitter.setLifespan(3000);
    this.emitter.setSpeed({ min: 150, max: 200 });
    this.emitter.setQuantity(100);
    this.emitter.setQuantity(50);
    this.emitter.explode();
    this.body.setVelocity(0, 0);
    this.visible = false;
    this.body.enable = false;
    this.active = false;
    this.popSound.play();
  }

  restart(x, y, imageKey, velocity) {   
    this.setPosition(x, y);
    this.imageKey = imageKey;
    this.velocity = velocity;

    let imageData = this.scene.textures.get(imageKey).getSourceImage();
    this.setSize(imageData.width, imageData.height);
    this.body.setSize(imageData.width, imageData.height);

    this.body.setVelocity(this.velocity.x, this.velocity.y);

    this.emitter.manager.setTexture(imageKey);
    this.rocket.setTexture(imageKey);
    this.emitter.setLifespan(500);
    this.emitter.setSpeed({min: 10, max: 15});
    this.emitter.setEmitZone({ type: 'edge', source: this.circle, quantity: 10 });
    this.emitter.setQuantity(8);
    this.emitter.flow(0);
    this.emitter.startFollow(this);
    this.emitter.visible = true;
    this.visible = true;
    this.body.enable = true; 
    this.active = true;
    this.launchSound.play();
  }
}