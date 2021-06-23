class Card extends Phaser.GameObjects.Sprite {
  opened = false;
  id;
  scene;
  position;

  constructor(scene, id) {
    super(scene, 0, 0, 'card');
    this.scene = scene;
    this.id = id;
    this.scene.add.existing(this);
    this.setInteractive();
  };

  init(position) {
    this.position = position;
    this.close();
    this.setPosition(-this.width, -this.height);
  };

  move(i, restart) {
    this.scene.tweens.add({
      targets: this,
      x: restart ? config.width + this.width : this.position.x,
      y: restart ? config.height + this.height : this.position.y,
      ease: 'Linear',
      delay: i * 100,
      duration: 150
    });
  };

  flip() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: 'Linear',
      duration: 150,
      onComplete: () => {
        this.show();
      }
    });
  };

  show() {
    const texture = this.opened ? `card${this.id}` : 'card';
    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: 'Linear',
      duration: 150
    });
  };

  open() {
    this.opened = true;
    this.flip();
  };

  close() {
    if (this.opened) {
      this.opened = false;
      this.flip();
    }
  };
}
