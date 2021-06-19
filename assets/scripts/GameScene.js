class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  };

  preload() {
    this.load.image('bg', 'assets/sprites/background.png');
    this.load.image('card', 'assets/sprites/card.png');

    config.cards.forEach(id => {
      this.load.image(`card${id}`, `assets/sprites/card${id}.png`);
    });
  };

  create() {
    this.createBackground();
    this.createCards();
    this.openedCard = null;
  };

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
  };

  createCards() {
    this.cards = [];
    const positions = this.getCardPositions();
    Phaser.Utils.Array.Shuffle(positions);

    config.cards.forEach(id => {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, id, positions.pop()));
      }
    });

    this.input.on('gameobjectdown', this.onCardClicked, this);
  };

  onCardClicked(e, card) {
    if (card.opened) {
      return false;
    }

    if (this.openedCard) {
      if (this.openedCard.id === card.id) {
        this.openedCard = null;

      } else {
        this.openedCard.close();
        this.openedCard = card;
      }

    } else {
      this.openedCard = card;
    }

    card.open();
  };

  getCardPositions() {
    const positions = [];

    const {width, height} = this.textures.get('card').getSourceImage();
    const cardWidth = width + 10, cardHeight = height + 10;

    const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2;
    const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({x: offsetX + col * cardWidth, y: offsetY + row * cardHeight});
      }
    }

    return positions;
  };
}
