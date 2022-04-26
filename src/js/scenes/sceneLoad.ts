import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import AUDIO from '../constants/AudioKeys';

export default class SceneLoad extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.LOAD,
    });
  }

  //////////////////////////////////////////////////
  // LIFECYCLE (init, preload, create, update)    //
  //////////////////////////////////////////////////

  init(): void {}

  preload(): void {
    // add text
    const screenCenterX = this.scale.width / 2;
    this.add
      .text(screenCenterX, 225, 'Loading...', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '28px',
      })
      .setOrigin(0.5);
    // create loading bar
    const loadingBar = this._createLoadingBar();
    this.load.on('progress', (nPercentage) => {
      loadingBar.fillRect(255, 255, 290 * nPercentage, 20);
    });

    // load spritesheets
    this.load.spritesheet(TEXTURES.GHOST, 'assets/sprites/spr_ghost.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(TEXTURES.OLDONE, 'assets/sprites/spr_oldone.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      TEXTURES.PHOTO_D,
      'assets/sprites/spr_photo_deepone.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      TEXTURES.PHOTO_H,
      'assets/sprites/spr_photo_human.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(
      TEXTURES.PHOTO_O,
      'assets/sprites/spr_photo_oldone.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(TEXTURES.PORTAL, 'assets/sprites/spr_portal.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(TEXTURES.HEART, 'assets/sprites/spr_heart.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this._createUnknownSprite();
    this._createPlayerSprites();
    // load images
    this.load.image(TEXTURES.BOOKS, 'assets/sprites/spr_books.png');
    this.load.image(
      TEXTURES.CHEST_CLOSED,
      'assets/sprites/spr_chest_closed.png',
    );
    this.load.image(TEXTURES.CHEST_OPEN, 'assets/sprites/spr_chest_open.png');
    this.load.image(TEXTURES.CLOVER, 'assets/sprites/spr_clover.png');
    this.load.image(TEXTURES.FLOOR, 'assets/sprites/spr_floor.png');
    this.load.image(TEXTURES.HOLE, 'assets/sprites/spr_hole.png');
    // load audio
    this.load.audio(AUDIO.DEATH, ['assets/sfx/death.wav']);
    this.load.audio(AUDIO.OPEN, ['assets/sfx/open.wav']);
    this.load.audio(AUDIO.PICKUP, ['assets/sfx/pickup.wav']);
    this.load.audio(AUDIO.TAKEDAMAGE, ['assets/sfx/takedamage.wav']);
  }

  create(): void {
    this.scene.start(SCENES.MENU);
  }

  update(): void {}

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  _createLoadingBar() {
    const loadingBg = this.add.graphics({
      fillStyle: {
        color: 0x222222,
      },
    });
    loadingBg.fillRect(250, 250, 300, 30);
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xcccccc,
      },
    });
    return loadingBar;
  }

  _createUnknownSprite() {
    const head = this._rndChar();
    let item = this._rndChar();
    let body = this._rndChar();
    while (item == head) {
      item = this._rndChar();
    }
    while (body == item || body == head) {
      body = this._rndChar();
    }
    const sSprite = `assets/sprites/spr_${head}${body}${item}.png`;

    this.load.spritesheet(TEXTURES.UNKNOWN, sSprite, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  _createPlayerSprites() {
    const headFinal = this._rndChar();
    let itemRandom = this._rndChar();
    let bodyRandom = this._rndChar();
    while (itemRandom == headFinal) {
      itemRandom = this._rndChar();
    }
    while (bodyRandom == itemRandom || bodyRandom == headFinal) {
      bodyRandom = this._rndChar();
    }
    const sSprite_1 = `assets/sprites/spr_${headFinal}${bodyRandom}${itemRandom}.png`;

    const itemFinal = headFinal;
    const sSprite_2 = `assets/sprites/spr_${headFinal}${bodyRandom}${itemFinal}.png`;

    const bodyFinal = headFinal;
    const sSprite_3 = `assets/sprites/spr_${headFinal}${bodyFinal}${itemFinal}.png`;

    this.load.spritesheet(TEXTURES.PLAYER_1, sSprite_1, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(TEXTURES.PLAYER_2, sSprite_2, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(TEXTURES.PLAYER_3, sSprite_3, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  _rndChar() {
    const nNumber = Phaser.Math.Between(1, 3);
    switch (nNumber) {
      case 1:
        return 'h';
      case 2:
        return 'd';
      case 3:
        return 'o';
    }
  }
}

