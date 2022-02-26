import TEXTURES from '../constants/TextureKeys';
import Helper from '../utils/helper';

/**
 * Config object for npc group
 */
type npcConfig = {
  /**
   * Is this type already known?
   */
  known?: boolean;
  /**
   * Texture to display when type is known
   */
  knownTexture?: string;
  /**
   * Moving if type is known
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

export default class NPCGroup extends Phaser.Physics.Arcade.Group {
  private npcConfig: npcConfig = {
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
    npcConfig?: npcConfig,
  ) {
    super(world, scene);
    scene.add.existing(this);
    this.npcConfig = Object.assign(this.npcConfig, npcConfig);

    this.spawnEnemies(scene);
  }

  /**
   * Spawn enemies within the scene
   * @param scene
   */
  spawnEnemies(scene) {
    const nQuantity = Phaser.Math.Between(
      this.npcConfig.minQuantity,
      this.npcConfig.maxQuantity,
    );

    const sTextureKey = this.npcConfig.known
      ? this.npcConfig.knownTexture
      : TEXTURES.UNKNOWN;

    for (let index = 0; index <= nQuantity; index++) {
      const { x, y } = Helper.createRandomCoords(scene);
      const npc = this.create(x, y, sTextureKey);
      npc.setBounceX(1);
      npc.setBounceY(1);
      npc.setCollideWorldBounds(true);
      npc.setImmovable(true);
      npc.setDepth(90);
      npc.revealTexture = this._revealTexture.bind(this);
      if (sTextureKey === TEXTURES.HOLE || sTextureKey === TEXTURES.UNKNOWN) {
        npc.setCircle(14, 2, 2);
      }
      // if unkown or known and knownMoving=true: Move around
      if (
        !this.npcConfig.known ||
        (this.npcConfig.known && this.npcConfig.knownMoving)
      ) {
        npc.play(sTextureKey);
        // move towards random direction
        const { velocityX, velocityY } = this._getRandomDirection();
        npc.setVelocity(velocityX, velocityY);
        // change direction sometimes
        const nDelay = Phaser.Math.Between(100, 3000);
        npc.changeDirectionEvent = scene.time.addEvent({
          delay: nDelay,
          callback: () => {
            const { velocityX, velocityY } = this._getRandomDirection();
            npc.setVelocity(velocityX, velocityY);
          },
          loop: true,
        });
      }
    }
  }

  stop() {
    this.getChildren().forEach((npc: Phaser.Physics.Arcade.Sprite) => {
      npc.setVelocity(0);
      if (npc['changeDirectionEvent']) {
        npc['changeDirectionEvent'].paused = true;
      }
    });
  }

  _revealTexture(npc: Phaser.Physics.Arcade.Sprite) {
    npc.stop();
    npc.setTexture(this.npcConfig.knownTexture);
  }

  tmpReveal(npc: Phaser.Physics.Arcade.Sprite) {
    if (!this.npcConfig.known) {
      npc.stop();
      npc.setTexture(this.npcConfig.knownTexture);
      if (this.scene.anims.exists(this.npcConfig.knownTexture)) {
        npc.play(this.npcConfig.knownTexture);
      }
    }
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        npc.setTexture(TEXTURES.UNKNOWN);
        npc.play(TEXTURES.UNKNOWN);
      },
      loop: false,
    });
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
        return { velocityX: this.npcConfig.velocity, velocityY: 0 };
      case 2:
        // right-down
        return {
          velocityX: this.npcConfig.velocity,
          velocityY: this.npcConfig.velocity,
        };
      case 3:
        // down
        return { velocityX: 0, velocityY: this.npcConfig.velocity };
      case 4:
        // down-left
        return {
          velocityX: -this.npcConfig.velocity,
          velocityY: this.npcConfig.velocity,
        };
      case 5:
        // left
        return { velocityX: -this.npcConfig.velocity, velocityY: 0 };
      case 6:
        // left-up
        return {
          velocityX: -this.npcConfig.velocity,
          velocityY: -this.npcConfig.velocity,
        };
      case 7:
        // up
        return { velocityX: 0, velocityY: -this.npcConfig.velocity };
      case 8:
        // up-right
        return {
          velocityX: this.npcConfig.velocity,
          velocityY: -this.npcConfig.velocity,
        };
    }
  }

  //////////////////////////////////////////////////
  // Getter & Setter                              //
  //////////////////////////////////////////////////

  getKnown() {
    return this.npcConfig.known;
  }

  setKnown(known: boolean) {
    this.npcConfig.known = known;
  }
}
