class Card extends Phaser.GameObjects.Sprite {
  opened = false;
  id;
  scene;

  constructor(scene, id) {
    super(scene, 0, 0, 'card');
    this.scene = scene;
    this.id = id;
    this.scene.add.existing(this);
    this.setInteractive();
  };

  flip(texture) {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: 'Linear',
      duration: 150,
      onComplete: () => {
        this.show(texture);
      }
    });
  };

  show(texture) {
    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: 'Linear',
      duration: 150
    });
  }

  open() {
    this.opened = true;
    this.flip(`card${this.id}`);
  };

  close() {
    this.opened = false;
    this.flip('card');
    console.log('close');
  };
}
