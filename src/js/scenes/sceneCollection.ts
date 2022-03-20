import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';
import SaveGame from '../objects/saveGame';

export default class SceneCollection extends Phaser.Scene {
  private saveGame: SaveGame;

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
    this.saveGame = new SaveGame();
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

    const collection = this.saveGame.getItems();
    let x = 145;
    let y = 180;
    Object.entries(collection).forEach(([key, value], index) => {
      if (index === 6) {
        y = y + 84;
        x = 145;
      }

      this._addItem(x, y, key, value);

      x = x + 84;
    });

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

  _addItem(x, y, item, known) {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x443731, 1);
    graphics.strokeRect(x, y, 64, 64);

    if (known) {
      this.physics.add
        .sprite(x + 30, y + 32, TEXTURES[item.toUpperCase()])
        .setOrigin(0.5);
    } else {
      this.add.text(x + 26, y, '?', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '48px',
      });
    }
  }
}
