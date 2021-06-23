class GameScene extends Phaser.Scene {
  openedCard;
  openedCardCount;
  cards;
  timeoutText;
  timeout = 0;
  sounds = {};
  timer;

  constructor(name) {
    super(name);
  };

  preload() {
    this.load.image('bg', 'assets/sprites/background.png');
    this.load.image('card', 'assets/sprites/card.png');

    config.cards.forEach(id => {
      this.load.image(`card${id}`, `assets/sprites/card${id}.png`);
    });

    this.load.audio('card', 'assets/sounds/card.mp3');
    this.load.audio('complete', 'assets/sounds/complete.mp3');
    this.load.audio('success', 'assets/sounds/success.mp3');
    this.load.audio('theme', 'assets/sounds/theme.mp3');
    this.load.audio('timeout', 'assets/sounds/timeout.mp3');
  };

  createText() {
    this.timeoutText = this.add.text(10, 330, '', {
      font: '36px CurseCasual',
      fill: '#ffff'
    });
  };

  createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeoutText.setText(`Time: ${this.timeout}`);

        if (this.timeout <= 0) {
          this.timer.paused = true;
          this.sounds.timeout.play();
          this.restart();

        } else {
          --this.timeout;
        }
      },
      loop: true
    });
  };

  createSounds() {
    this.sounds.card = this.sound.add('card');
    this.sounds.complete = this.sound.add('complete');
    this.sounds.success = this.sound.add('success');
    this.sounds.theme = this.sound.add('theme');
    this.sounds.timeout = this.sound.add('timeout');

    this.sounds.theme.play({volume: 0.1});
  };

  create() {
    this.timeout = config.timeout;
    this.createSounds();
    this.createTimer();
    this.createBackground();
    this.createText();
    this.createCards();
    this.start();
  };

  start() {
    this.timeout = config.timeout;
    this.openedCard = null;
    this.openedCardCount = 0;
    this.timer.paused = false;
    this.initCards();
    this.showCards();
  };

  restart() {
    this.cards.forEach((card, i) => {
      card.move(i + 1, true);
    });

    setTimeout(() => {
      this.start();
    }, this.cards.length * 120);
  };

  initCards() {
    const positions = this.getCardPositions();
    this.cards.forEach(card => {
      card.init(positions.pop());
    });
  };

  showCards() {
    this.cards.forEach((card, i) => {
      card.depth = i + 1;
      card.move(i + 1);
    });
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

    this.sounds.card.play();

    if (this.openedCard) {
      if (this.openedCard.id === card.id) {
        this.openedCard = null;
        this.openedCardCount += 1;
        this.sounds.success.play();

      } else {
        this.openedCard.close();
        this.openedCard = card;
      }

    } else {
      this.openedCard = card;
    }

    card.open();

    if (this.openedCardCount === this.cards.length / 2) {
      this.sounds.complete.play();
      this.restart();
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
