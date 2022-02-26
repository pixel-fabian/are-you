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
    this.load.spritesheet(TEXTURES.PLAYER_DDD, 'assets/sprites/spr_ddd.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(TEXTURES.PLAYER_HHH, 'assets/sprites/spr_hhh.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(TEXTURES.PLAYER_OOO, 'assets/sprites/spr_ooo.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
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
}
