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
  private floorHoles?;
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
    this._createFloor();
    this._createAnimations();
    this._createControls();
    this._spawnHoles();

    const { x, y } = this._createRandomCoords();
    this.player = this.physics.add.sprite(x, y, TEXTURES.UNKNOWN, 0);
    this.player.play('unknown');
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(
      this.player,
      this.floorHoles,
      this._onCollidePlayerHoles,
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
      key: 'unknown',
      frames: this.anims.generateFrameNumbers(TEXTURES.UNKNOWN, {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1, // -1: infinity
    });
  }

  _createRandomCoords() {
    // width and height of the game screen
    const width = this.scale.width;
    const height = this.scale.height;

    const x = Phaser.Math.Between(0, width - 16);
    const y = Phaser.Math.Between(0, height - 16);

    return { x, y };
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

  _spawnHoles() {
    const nNumberHoles = Phaser.Math.Between(5, 12);
    this.floorHoles = this.physics.add.group({
      key: TEXTURES.UNKNOWN,
      quantity: nNumberHoles,
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true,
    });
    // spawn randomly
    Phaser.Actions.RandomRectangle(
      this.floorHoles.getChildren(),
      this.physics.world.bounds,
    );
    this.floorHoles.getChildren().forEach((hole) => {
      hole.play('unknown');
      // move towards random direction
      const { velocityX, velocityY } = this._getRandomDirection();
      hole.setVelocity(velocityX, velocityY);
      // change direction
      const nDelay = Phaser.Math.Between(200, 5000);
      hole.changeDirectionEvent = this.time.addEvent({
        delay: nDelay,
        callback: () => {
          const { velocityX, velocityY } = this._getRandomDirection();
          hole.setVelocity(velocityX, velocityY);
        },
        loop: true,
      });
    });
  }

  _onCollidePlayerHoles() {
    console.log(this);
  }

  _getRandomDirection() {
    const nDirection = Phaser.Math.Between(0, 8);
    switch (nDirection) {
      case 0:
        // stand still
        return { velocityX: 0, velocityY: 0 };
      case 1:
        // right
        return { velocityX: this.velocity, velocityY: 0 };
      case 2:
        // right-down
        return { velocityX: this.velocity, velocityY: this.velocity };
      case 3:
        // down
        return { velocityX: 0, velocityY: this.velocity };
      case 4:
        // down-left
        return { velocityX: -this.velocity, velocityY: this.velocity };
      case 5:
        // left
        return { velocityX: -this.velocity, velocityY: 0 };
      case 6:
        // left-up
        return { velocityX: -this.velocity, velocityY: -this.velocity };
      case 7:
        // up
        return { velocityX: 0, velocityY: -this.velocity };
      case 8:
        // up-right
        return { velocityX: this.velocity, velocityY: -this.velocity };
    }
  }
}
