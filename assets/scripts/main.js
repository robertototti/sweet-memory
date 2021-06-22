const {offsetWidth, offsetHeight} = document.body;

const config = {
  type: Phaser.AUTO,
  width: offsetWidth > 1280 ? 1280 : offsetWidth,
  height: offsetHeight > 720 ? 720 : offsetHeight,
  rows: 2,
  cols: 5,
  cards: [1, 2, 3, 4, 5],
  timeout: 30,
  scene: new GameScene('Game')
};

const game = new Phaser.Game(config);
