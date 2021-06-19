class Card extends Phaser.GameObjects.Sprite {
  opened = false;

  constructor(scene, id, position) {
    super(scene, position.x, position.y, 'card');
    this.scene = scene;
    this.id = id;
    this.setOrigin(0, 0);
    this.scene.add.existing(this);
    this.setInteractive();
  };

  open() {
    this.setTexture(`card${this.id}`);
    this.opened = true;
  };

  close() {
    this.setTexture('card');
    this.opened = false;
  };
}
