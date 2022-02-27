import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';
import Player from '../objects/player';

export default class SceneWinning extends Phaser.Scene {
  private player?: Player;
  constructor() {
    super({
      key: SCENES.WINNING,
    });
  }

  //////////////////////////////////////////////////
  // LIFECYCLE (init, preload, create, update)    //
  //////////////////////////////////////////////////

  init(): void {}

  preload(): void {}

  create(): void {
    Helper.createFloor(this, TEXTURES.FLOOR);
    this._createAnimations();
    this.player = new Player(this, 400, 400, TEXTURES.PLAYER_3, 0);
    this.player.play(TEXTURES.PLAYER_3);
    this.player.setCircle(14, 2, 2);
    // add text
    const screenCenterX = this.scale.width / 2;
    const text = [
      'Oh God!',
      'What I saw is ... unbelievable,',
      "it's not possible ... it's madness!",
      'At least ... I know myself.',
      'I know who I am.',
      'At least I am real ...',
    ];
    this.add
      .text(screenCenterX, 180, text, {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '48px',
        align: 'center',
      })
      .setOrigin(0.5);
    this.add
      .text(screenCenterX, 500, 'Thank you for playing :)', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '48px',
      })
      .setOrigin(0.5);
    this._createTextButton(screenCenterX, 550, '< to menu >', SCENES.MENU);
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

  _createAnimations() {
    this.anims.create({
      key: TEXTURES.PLAYER_3,
      frames: this.anims.generateFrameNumbers(TEXTURES.PLAYER_3, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
  }
}
