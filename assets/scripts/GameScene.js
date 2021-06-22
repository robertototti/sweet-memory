class GameScene extends Phaser.Scene {
  openedCard;
  openedCardCount;
  cards;
  timeoutText;
  timeout = 0;

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

  createText() {
    this.timeoutText = this.add.text(10, 330, '', {
      font: '36px CurseCasual',
      fill: '#ffff'
    });
  };

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeoutText.setText(`Time: ${this.timeout}`);

        if (this.timeout <= 0) {
          this.start();

        } else {
          --this.timeout;
        }
      },
      loop: true
    });
  };

  create() {
    this.timeout = config.timeout;
    this.createBackground();
    this.createText();
    this.createCards();
    this.createTimer();
    this.start();
  };

  start() {
    this.timeout = config.timeout;
    this.openedCard = null;
    this.openedCardCount = 0;
    this.initCards();
  };

  initCards() {
    const positions = this.getCardPositions();
    this.cards.forEach(card => {
      const position = positions.pop();
      card.close();
      card.setPosition(position.x, position.y);
    })
  };

  createBackground() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
  };

  createCards() {
    this.cards = [];

    config.cards.forEach(id => {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, id));
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
        this.openedCardCount += 1;

      } else {
        this.openedCard.close();
        this.openedCard = card;
      }

    } else {
      this.openedCard = card;
    }

    card.open();

    if (this.openedCardCount === this.cards.length / 2) {
      this.start();
    }
  };

  getCardPositions() {
    const positions = [];

    const {width, height} = this.textures.get('card').getSourceImage();
    const cardWidth = width + 10, cardHeight = height + 10;

    const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
    const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({x: offsetX + col * cardWidth, y: offsetY + row * cardHeight});
      }
    }

    return Phaser.Utils.Array.Shuffle(positions);
  };
}
