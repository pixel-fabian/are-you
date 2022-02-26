import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';

/**
 * Config object for enemy group
 */
type enemyConfig = {
  /**
   * Is this type already known?
   */
  known?: boolean;
  /**
   * Texture to display when type is known
   */
  knownTexture?: string;
  /**
   * Enemies moving in when type is known
   */
  knownMoving?: boolean;
  /**
   * Minimum number so spawn
   */
  minQuantity?: number;
  /**
   * Max number so spawn
   */
  maxQuantity?: number;
  /**
   * velocity
   */
  velocity?: number;
};

export default class Enemies extends Phaser.Physics.Arcade.Group {
  private enemyConfig: enemyConfig = {
    known: false,
    knownTexture: TEXTURES.UNKNOWN,
    knownMoving: false,
    minQuantity: 5,
    maxQuantity: 12,
    velocity: 100,
  };

  /**
   *
   * @param world
   * @param scene
   * @param children
   * @param config
   */
  constructor(
    world: Phaser.Physics.Arcade.World,
    scene: Phaser.Scene,
    enemyConfig?: enemyConfig,
  ) {
    super(world, scene);
    scene.add.existing(this);
    this.enemyConfig = Object.assign(this.enemyConfig, enemyConfig);

    this.spawnEnemies(scene);
  }

  /**
   * Spawn enemies within the scene
   * @param scene
   */
  spawnEnemies(scene) {
    const nQuantity = Phaser.Math.Between(
      this.enemyConfig.minQuantity,
      this.enemyConfig.maxQuantity,
    );

    const sTextureKey = this.enemyConfig.known
      ? this.enemyConfig.knownTexture
      : TEXTURES.UNKNOWN;

    for (let index = 0; index <= nQuantity; index++) {
      const { x, y } = Helper.createRandomCoords(scene);
      const enemy = this.create(x, y, sTextureKey);
      enemy.setBounceX(1);
      enemy.setBounceY(1);
      enemy.setCollideWorldBounds(true);
      enemy.setImmovable(true);
      enemy.setDepth(90);
      enemy.revealTexture = this._revealTexture.bind(this);
      if (sTextureKey === TEXTURES.HOLE || sTextureKey === TEXTURES.UNKNOWN) {
        enemy.setCircle(14, 2, 2);
      }
      // if unkown or known and knownMoving=true: Move around
      if (
        !this.enemyConfig.known ||
        (this.enemyConfig.known && this.enemyConfig.knownMoving)
      ) {
        enemy.play(sTextureKey);
        // move towards random direction
        const { velocityX, velocityY } = this._getRandomDirection();
        enemy.setVelocity(velocityX, velocityY);
        // change direction sometimes
        const nDelay = Phaser.Math.Between(100, 3000);
        enemy.changeDirectionEvent = scene.time.addEvent({
          delay: nDelay,
          callback: () => {
            const { velocityX, velocityY } = this._getRandomDirection();
            enemy.setVelocity(velocityX, velocityY);
          },
          loop: true,
        });
      }
    }
  }

  stop() {
    this.getChildren().forEach((enemy: Phaser.Physics.Arcade.Sprite) => {
      enemy.setVelocity(0);
      if (enemy['changeDirectionEvent']) {
        enemy['changeDirectionEvent'].paused = true;
      }
    });
  }

  _revealTexture(enemy: Phaser.Physics.Arcade.Sprite) {
    enemy.stop();
    enemy.setTexture(this.enemyConfig.knownTexture);
  }

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  _getRandomDirection() {
    const nDirection = Phaser.Math.Between(0, 8);
    switch (nDirection) {
      case 0:
        // stand still
        return { velocityX: 0, velocityY: 0 };
      case 1:
        // right
        return { velocityX: this.enemyConfig.velocity, velocityY: 0 };
      case 2:
        // right-down
        return {
          velocityX: this.enemyConfig.velocity,
          velocityY: this.enemyConfig.velocity,
        };
      case 3:
        // down
        return { velocityX: 0, velocityY: this.enemyConfig.velocity };
      case 4:
        // down-left
        return {
          velocityX: -this.enemyConfig.velocity,
          velocityY: this.enemyConfig.velocity,
        };
      case 5:
        // left
        return { velocityX: -this.enemyConfig.velocity, velocityY: 0 };
      case 6:
        // left-up
        return {
          velocityX: -this.enemyConfig.velocity,
          velocityY: -this.enemyConfig.velocity,
        };
      case 7:
        // up
        return { velocityX: 0, velocityY: -this.enemyConfig.velocity };
      case 8:
        // up-right
        return {
          velocityX: this.enemyConfig.velocity,
          velocityY: -this.enemyConfig.velocity,
        };
    }
  }

  //////////////////////////////////////////////////
  // Getter & Setter                              //
  //////////////////////////////////////////////////

  getKnown() {
    return this.enemyConfig.known;
  }

  setKnown(known: boolean) {
    this.enemyConfig.known = known;
  }
}
