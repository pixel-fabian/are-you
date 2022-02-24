import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';
import Player from '../objects/player';
import Enemies from '../objects/enemies';

export default class SceneGame extends Phaser.Scene {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private velocity = 100;
  private player?: Player;
  private holes?: Enemies;
  private ghosts?: Enemies;
  private knownElements = {
    holes: false,
    ghosts: false,
    player: false,
  };

  constructor() {
    super({
      key: SCENES.GAME,
    });
  }

  //////////////////////////////////////////////////
  // LIFECYCLE (init, preload, create, update)    //
  //////////////////////////////////////////////////

  init(data): void {
    if (data.knownElements) {
      this.knownElements = Object.assign(
        this.knownElements,
        data.knownElements,
      );
    }
  }

  preload(): void {}

  create(): void {
    Helper.createFloor(this, TEXTURES.FLOOR);
    this._createAnimations();
    this._createControls();
    this._spawnHoles();
    this._spawnGhosts();

    const { x, y } = Helper.createRandomCoords(this);
    this.player = new Player(this, x, y, TEXTURES.UNKNOWN, 0);
    this.player.play(TEXTURES.UNKNOWN);
    this.player.setCircle(14, 2, 2);

    this.physics.add.collider(
      this.player,
      this.holes,
      this._onCollisionPlayerHole,
      null,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.ghosts,
      this._onCollisionPlayerGhost,
      null,
      this,
    );
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
      key: TEXTURES.UNKNOWN,
      frames: this.anims.generateFrameNumbers(TEXTURES.UNKNOWN, {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.GHOST,
      frames: this.anims.generateFrameNumbers(TEXTURES.GHOST, {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1, // -1: infinity
    });
  }

  _spawnHoles() {
    this.holes = new Enemies(this.physics.world, this, {
      known: this.knownElements.holes,
      knownTexture: TEXTURES.HOLE,
      knownMoving: false,
      minQuantity: 5,
      maxQuantity: 12,
      velocity: this.velocity,
    });
  }

  _onCollisionPlayerHole() {
    if (!this.knownElements.holes) {
      this.knownElements.holes = true;
    }
    this.scene.start(SCENES.GAME, {
      knownElements: this.knownElements,
    });
  }

  _spawnGhosts() {
    this.ghosts = new Enemies(this.physics.world, this, {
      known: this.knownElements.ghosts,
      knownTexture: TEXTURES.GHOST,
      knownMoving: true,
      minQuantity: 5,
      maxQuantity: 12,
      velocity: this.velocity,
    });
  }

  _onCollisionPlayerGhost() {
    if (!this.knownElements.ghosts) {
      this.knownElements.ghosts = true;
    }
    this.scene.start(SCENES.GAME, {
      knownElements: this.knownElements,
    });
  }
}
