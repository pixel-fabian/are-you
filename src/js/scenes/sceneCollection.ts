import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';

export default class SceneCollection extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.COLLECTION,
    });
  }

  //////////////////////////////////////////////////
  // LIFECYCLE (init, preload, create, update)    //
  //////////////////////////////////////////////////

  init(): void {}

  preload(): void {}

  create(): void {
    Helper.createFloor(this, TEXTURES.FLOOR);
    // add text
    const screenCenterX = this.scale.width / 2;
    this.add
      .text(screenCenterX, 80, 'Collection', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '68px',
      })
      .setOrigin(0.5);
    this.add
      .text(screenCenterX, 300, 'coming soon...', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '36px',
      })
      .setOrigin(0.5);
    this._createTextButton(60, 600, '<- back', SCENES.MENU);
  }

  update(): void {}

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  _createTextButton(
    nX: number,
    nY: number,
    sText: string,
    sStartScene: SCENES,
  ) {
    const text = this.add
      .text(nX, nY, sText, {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '42px',
      })
      .setOrigin(0.5);
    text.setInteractive({ useHandCursor: true });
    text.on('pointerover', () => {
      text.setColor('#eee');
    });
    text.on('pointerout', () => {
      text.setColor('#fff');
    });
    text.on('pointerdown', () => {
      this.scene.start(sStartScene);
    });
  }
}
