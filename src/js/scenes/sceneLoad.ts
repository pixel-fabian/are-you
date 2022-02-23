import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
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

    // load all textures
    this.load.spritesheet(
      TEXTURES.UNKNOWN,
      'assets/sprites/spr_pixelhaufen.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet(TEXTURES.GHOST, 'assets/sprites/spr_ghost.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image(TEXTURES.FLOOR, 'assets/sprites/spr_floor.png');
    this.load.image(TEXTURES.HOLE, 'assets/sprites/spr_hole.png');
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
