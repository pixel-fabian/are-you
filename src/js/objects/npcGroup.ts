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
   * Textures to display when type is known
   */
  knownTextures?: Array<string>;
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
    minQuantity: 4,
    maxQuantity: 8,
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

    for (let index = 0; index < nQuantity; index++) {
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
      // if unkown, or known and knownMoving=true: Move around
      if (
        !this.npcConfig.known ||
        (this.npcConfig.known && this.npcConfig.knownMoving)
      ) {
        npc.play(sTextureKey);
        // move towards random direction
        const vDirection = this._getRandomDirection();
        npc.setVelocity(vDirection.x, vDirection.y);
        this._setFlip(vDirection.x, npc);
        // change direction sometimes
        const nDelay = Phaser.Math.Between(100, 3000);
        npc.changeDirectionEvent = scene.time.addEvent({
          delay: nDelay,
          callback: () => {
            const vDirection = this._getRandomDirection();
            if (npc.body) {
              npc.setVelocity(vDirection.x, vDirection.y);
              this._setFlip(vDirection.x, npc);
            }
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

  resume() {
    this.getChildren().forEach((npc: Phaser.Physics.Arcade.Sprite) => {
      if (npc['changeDirectionEvent']) {
        npc['changeDirectionEvent'].paused = false;
      }
    });
  }

  _revealTexture(npc: Phaser.Physics.Arcade.Sprite) {
    npc['revealed'] = true;
    npc.stop();

    if (npc['knownTexture']) {
      // if child has knownTexture use this
      npc.setTexture(npc['knownTexture']);
      if (this.scene.anims.exists(npc['knownTexture'])) {
        npc.play(npc['knownTexture']);
      }
    } else {
      // else use the one for the group
      npc.setTexture(this.npcConfig.knownTexture);
      if (this.scene.anims.exists(this.npcConfig.knownTexture)) {
        npc.play(this.npcConfig.knownTexture);
      }
    }
  }

  tmpReveal(npc: Phaser.Physics.Arcade.Sprite) {
    if (!this.npcConfig.known) {
      npc.stop();
      if (npc['knownTexture']) {
        // if child has knownTexture use this
        npc.setTexture(npc['knownTexture']);
        if (this.scene.anims.exists(npc['knownTexture'])) {
          npc.play(npc['knownTexture']);
        }
      } else {
        // else use the one for the group
        npc.setTexture(this.npcConfig.knownTexture);
        if (this.scene.anims.exists(this.npcConfig.knownTexture)) {
          npc.play(this.npcConfig.knownTexture);
        }
      }
      this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          if (!npc['revealed']) {
            npc.setTexture(TEXTURES.UNKNOWN);
            npc.play(TEXTURES.UNKNOWN);
          }
        },
        loop: false,
      });
    }
  }

  setDifferentTextures(aTextures = []) {
    this.getChildren().forEach((child: Phaser.Physics.Arcade.Sprite, index) => {
      if (aTextures[index]) {
        child.stop();
        child.setTexture(aTextures[index]);
        if (this.scene.anims.exists(aTextures[index])) {
          child.play(aTextures[index]);
        }
      }
    });
  }

  setDifferentKnownTextures(aTextures = []) {
    this.getChildren().forEach((child: Phaser.Physics.Arcade.Sprite, index) => {
      if (aTextures[index]) {
        child['knownTexture'] = aTextures[index];
      }
    });
  }

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  /**
   * Get a random direction
   * @returns Phaser.Math.Vector2
   */
  _getRandomDirection() {
    const nDirection = Phaser.Math.Between(0, 8);
    // movement as vector to ensure same speed diagonally
    const vDirection = new Phaser.Math.Vector2(0, 0);

    switch (nDirection) {
      case 1:
        // right
        vDirection.x += 1;
        vDirection.y = 0;
        break;
      case 2:
        // right-down
        vDirection.x += 1;
        vDirection.y += 1;
        break;
      case 3:
        // down
        vDirection.x = 0;
        vDirection.y += 1;
        break;
      case 4:
        // down-left
        vDirection.x -= 1;
        vDirection.y += 1;
        break;
      case 5:
        // left
        vDirection.x -= 1;
        vDirection.y = 0;
        break;
      case 6:
        // left-up
        vDirection.x -= 1;
        vDirection.y -= 1;
        break;
      case 7:
        // up
        vDirection.x = 0;
        vDirection.y -= 1;
        break;
      case 8:
        // up-right
        vDirection.x += 1;
        vDirection.y -= 1;
        break;
      default:
        // stand still
        vDirection.x = 0;
        vDirection.y = 0;
        break;
    }
    return vDirection.setLength(this.npcConfig.velocity);
  }

  _setFlip(velocityX, sprite) {
    if (velocityX >= 0) {
      sprite.flipX = false;
    } else if (velocityX < 0) {
      sprite.flipX = true;
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
