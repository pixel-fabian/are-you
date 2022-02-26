import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import AUDIO from '../constants/AudioKeys';
import Helper from '../utils/helper';
import Player from '../objects/player';
import Enemies from '../objects/enemies';
import Chest from '../objects/chest';
import Item from '../objects/item';

export default class SceneGame extends Phaser.Scene {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyE: Phaser.Input.Keyboard.Key;
  private velocity: number = 90;
  private lifes: number = 3;
  private pauseMovement: boolean = false;
  private player?: Player;
  private holes?: Enemies;
  private ghosts?: Enemies;
  private chests: Chest[] = [];
  private items: Item[] = [];
  private soundDeath?: Phaser.Sound.BaseSound;
  private soundPickup?: Phaser.Sound.BaseSound;
  private textAreYou?: Phaser.GameObjects.Text;
  private textLifes?: Phaser.GameObjects.Text;
  private collision: boolean;
  private pickup: boolean = false;
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

  init(): void {
    this.pauseMovement = false;
    this.collision = false;
  }

  preload(): void {}

  create(): void {
    Helper.createFloor(this, TEXTURES.FLOOR);
    this._createAnimations();
    this._createControls();
    this._spawnChests(3, TEXTURES.CLOVER);
    this._spawnHoles();
    this._spawnGhosts();

    const { x, y } = Helper.createRandomCoords(this);
    this.player = new Player(this, x, y, TEXTURES.UNKNOWN, 0);
    this.player.play(TEXTURES.UNKNOWN);
    this.player.setCircle(14, 2, 2);
    this.player.setPower(TEXTURES.CLOVER);

    this._addCollider();
    this.textLifes = this.add.text(10, 0, `Lifes: ${this.lifes}`, {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this.soundDeath = this.sound.add(AUDIO.DEATH);
    this.soundPickup = this.sound.add(AUDIO.PICKUP);
  }

  update(): void {
    this._movePlayer();

    if (!this.pauseMovement) {
      if (this.keyE.isDown) {
        this.player.useClover();
      }
      this.player.updateCloverPosition();
    }
  }

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////

  _createControls() {
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  _movePlayer() {
    this.player.setVelocity(0);

    if (!this.pauseMovement) {
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

  _addCollider() {
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
    this.physics.add.collider(
      this.player,
      this.chests,
      this._onCollisionPlayerChest,
      null,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.items,
      this._onCollisionPlayerItem,
      null,
      this,
    );
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

  _onCollisionPlayerHole(
    player: Phaser.Physics.Arcade.Sprite,
    hole: Phaser.Physics.Arcade.Sprite,
  ) {
    // collide only if no ongoing collision and player is not moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    this.collision = true;
    if (!this.knownElements.holes) {
      this.knownElements.holes = true;
      this._revealElement(hole);
    } else {
      this._looseLife();
    }
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

  _onCollisionPlayerGhost(player, ghost) {
    // collide only if no ongoing collision and player is not moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    this.collision = true;
    if (!this.knownElements.ghosts) {
      this.knownElements.ghosts = true;
      this._revealElement(ghost);
    } else {
      this._looseLife();
    }
  }

  _spawnChests(nQuantity, sItem) {
    for (let index = 0; index < nQuantity; index++) {
      const { x, y } = Helper.createRandomCoords(this);
      if (index == 0) {
        // Only one chest contains the item
        const chest = new Chest(
          this,
          x,
          y,
          TEXTURES.CHEST_CLOSED,
          TEXTURES.CHEST_OPEN,
          sItem,
        );
        this.chests.push(chest);
      } else {
        const chest = new Chest(
          this,
          x,
          y,
          TEXTURES.CHEST_CLOSED,
          TEXTURES.CHEST_OPEN,
        );
        this.chests.push(chest);
      }
    }
  }

  _onCollisionPlayerChest(player, chest) {
    // open if colliding an action button is pressed
    if (this.keyE.isDown) {
      chest.open(this);
    }
  }

  _onCollisionPlayerItem(player, item) {
    if (this.pickup) return;
    this.pickup = true;
    this.soundPickup.play();
    player.setPower(TEXTURES.CLOVER);
    this.tweens.add({
      targets: item,
      angle: 360,
      yoyo: false,
      repeat: 0,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: item,
      scale: 0.2,
      yoyo: false,
      repeat: 0,
      ease: 'Sine.easeInOut',
    });
    this.time.addEvent({
      delay: 500,
      callback: () => {
        item.destroy();
      },
      loop: false,
    });
  }

  _revealElement(element) {
    if (this.pauseMovement) return;
    this.soundDeath.play();
    this.pauseMovement = true;
    this.holes.stop();
    this.ghosts.stop();
    this.cameras.main.zoomTo(1.5, 700, 'Sine.easeOut');
    this.cameras.main.startFollow(this.player);
    this.time.addEvent({
      delay: 800,
      callback: () => {
        this.cameras.main.zoomTo(2, 700, 'Sine.easeOut');
        this.textAreYou = this.add
          .text(this.player.x, this.player.y - 40, '', {
            fontFamily: 'BitPotion',
            color: '#fff',
            fontSize: '92px',
          })
          .setOrigin(0.5, 1);
        this.textAreYou.setAlpha(0.5);
        Helper.textTypewriter(this, this.textAreYou, 'Are you?');
      },
      loop: false,
    });
    this.time.addEvent({
      delay: 1600,
      callback: () => {
        this.cameras.main.zoomTo(2.5, 700, 'Sine.easeOut');
        element.revealTexture(element);
        Helper.createTextButton(
          this,
          this.player.x,
          this.player.y + 50,
          '< continue >',
          this._continue,
        );
      },
      loop: false,
    });
  }

  _looseLife() {
    this.lifes--;
    this.textLifes.text = `Lifes: ${this.lifes}`;
    if (this.lifes == 0) {
      console.log('GAME OVER');
    } else {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.collision = false;
        },
        loop: false,
      });
    }
  }

  _continue(context) {
    context.scene.start(SCENES.GAME, {
      knownElements: context.knownElements,
      lifes: context.lifes,
    });
  }
}
