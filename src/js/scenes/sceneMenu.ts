import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';

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
    this._createFloor();
    // add text
    const screenCenterX = this.scale.width / 2;
    this.add
      .text(screenCenterX, 80, 'Are you?', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '92px',
      })
      .setOrigin(0.5);
    this.add.text(20, 600, 'Controls: WASD', {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this._createTextButton(screenCenterX, 200, '< play >', SCENES.GAME);
    //this._createButton(400, 200, TEXTURES.BUTTON_PLAY, SCENES.GAME);
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

  _createFloor() {
    const aLevel = [];
    const nRows = this.scale.height / 32;
    const nColumns = this.scale.width / 32;
    // create 2D array with random tile numbers
    for (let rowIndex = 0; rowIndex < nRows; rowIndex++) {
      const aRow = [];
      for (let columnIndex = 0; columnIndex < nColumns; columnIndex++) {
        const nTile = Phaser.Math.Between(0, 3);
        aRow.push(nTile);
      }
      aLevel.push(aRow);
    }
    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = this.make.tilemap({
      data: aLevel,
      tileWidth: 32,
      tileHeight: 32,
    });
    const tiles = map.addTilesetImage(TEXTURES.FLOOR);
    map.createLayer(0, tiles, 0, 0);
  }
}
