import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
export default class SceneGame extends Phaser.Scene {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private player?;
  private velocity = 100;
  private enemies: Phaser.Physics.Arcade.Group;

  constructor() {
    super({
      key: SCENES.GAME,
    });
  }

  //////////////////////////////////////////////////
  // LIFECYCLE (init, preload, create, update)    //
  //////////////////////////////////////////////////

  init(): void {}

  preload(): void {}

  create(): void {
    this.player = this.physics.add.sprite(32, 32, TEXTURES.UNKNOWN, 0);
    this._createAnimations();
    this._createControls();
    this.player.play('unknown');
    this.player.setCollideWorldBounds(true);
  }

  update(): void {
    this._movePlayer();
  }

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  _createControls() {
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  _movePlayer() {
    this.player.setVelocity(0);
    if (this.keyA.isDown) {
      this.player.setVelocityX(-this.velocity);
    } else if (this.keyD.isDown) {
      this.player.setVelocityX(this.velocity);
    }
    if (this.keyW.isDown) {
      this.player.setVelocityY(-this.velocity);
    } else if (this.keyS.isDown) {
      this.player.setVelocityY(this.velocity);
    }
  }

  _createAnimations() {
    this.anims.create({
      key: 'unknown',
      frames: this.anims.generateFrameNumbers(TEXTURES.UNKNOWN, {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1, // -1: infinity
    });
  }
}
