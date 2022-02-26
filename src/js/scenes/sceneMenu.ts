import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';

export default class SceneMenu extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.MENU,
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
      .text(screenCenterX, 80, 'Are you?', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '92px',
      })
      .setOrigin(0.5);
    this.add.text(20, 560, 'Controls:', {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this.add.text(20, 580, 'walk: WASD', {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this.add.text(20, 600, 'interact: E or Q', {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this._createTextButton(screenCenterX, 200, '< play >', SCENES.GAME);
    this._createTextButton(
      screenCenterX,
      260,
      '< collection >',
      SCENES.COLLECTION,
    );
    this._createTextButton(screenCenterX, 320, '< credits >', SCENES.CREDITS);
  }

  update(): void {}

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  _createButton(
    nX: number,
    nY: number,
    sTextureKey: TEXTURES,
    sStartScene: SCENES,
  ) {
    const button = this.add.sprite(nX, nY, sTextureKey, 0);
    button.setScale(3);
    const pressAnimKey = `press${sTextureKey}`;
    this.anims.create({
      key: pressAnimKey,
      frames: this.anims.generateFrameNumbers(sTextureKey, {
        start: 0,
        end: 2,
      }),
      frameRate: 12,
      repeat: 0,
    });
    button.setInteractive({ useHandCursor: true });
    button.on('pointerover', () => {
      button.setFrame(3);
    });
    button.on('pointerout', () => {
      button.setFrame(0);
    });
    button.on('pointerdown', () => {
      button.play(pressAnimKey);
    });
    button.on(
      'animationcomplete',
      (animation) => {
        switch (animation.key) {
          case pressAnimKey:
            this.scene.start(sStartScene);
            break;
        }
      },
      this,
    );

    return button;
  }

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
