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
    // load all textures
    this.load.spritesheet(TEXTURES.BUTTON_PLAY, 'assets/button_01_play.png', {
      frameWidth: 64,
      frameHeight: 32,
    });
    this.load.spritesheet(
      TEXTURES.UNKNOWN,
      'assets/sprites/spr_pixelhaufen.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );

    // create loading bar
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
      },
    });
    this.load.on('progress', (nPercentage) => {
      loadingBar.fillRect(30, 300, 740 * nPercentage, 40);
    });
  }

  create(): void {
    this.scene.start(SCENES.MENU);
  }

  update(): void {}

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////
}
