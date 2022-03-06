import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';
import SliderPlugin from 'phaser3-rex-plugins/plugins/slider.js';

export default class SceneSettings extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.SETTINGS,
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
      .text(screenCenterX, 80, 'Settings', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '68px',
      })
      .setOrigin(0.5);

    this._createVolumeSlider();

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

  _createVolumeSlider() {
    this.add
      .text(250, 180, 'SFX:', {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '42px',
      })
      .setOrigin(0.5);
    const img = this.add.rectangle(420, 185, 15, 15, 0xffffff);
    const sliderEndPoints: [
      { x: number; y: number },
      { x: number; y: number },
    ] = [
      {
        x: img.x - 120,
        y: img.y,
      },
      {
        x: img.x + 120,
        y: img.y,
      },
    ];
    new SliderPlugin(img, {
      endPoints: sliderEndPoints,
      value: this._getSoundVolume(),
      enable: true,
      valuechangeCallback: this._setSoundVolume,
      valuechangeCallbackScope: this,
    });
    this.add.graphics().lineStyle(3, 0xffffff, 1).strokePoints(sliderEndPoints);
  }

  _setSoundVolume(newValue) {
    const soundManager = this.game.sound;
    if (
      soundManager instanceof Phaser.Sound.HTML5AudioSoundManager ||
      soundManager instanceof Phaser.Sound.WebAudioSoundManager
    ) {
      soundManager.setVolume(newValue);
    }
  }

  _getSoundVolume() {
    const soundManager = this.game.sound;
    if (
      soundManager instanceof Phaser.Sound.HTML5AudioSoundManager ||
      soundManager instanceof Phaser.Sound.WebAudioSoundManager
    ) {
      return soundManager.volume;
    } else {
      return 1;
    }
  }
}
