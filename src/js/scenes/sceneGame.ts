import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import AUDIO from '../constants/AudioKeys';
import Helper from '../utils/helper';
import Player from '../objects/player';
import NPCGroup from '../objects/npcGroup';
import Chest from '../objects/chest';
import Item from '../objects/item';

export default class SceneGame extends Phaser.Scene {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyE: Phaser.Input.Keyboard.Key;
  private keyQ: Phaser.Input.Keyboard.Key;
  private velocity: number = 90;
  private lifes: number = 3;
  private photosCollected: number = 0;
  private pauseMovement: boolean = false;
  private player?: Player;
  private holes?: NPCGroup;
  private ghosts?: NPCGroup;
  private books?: NPCGroup;
  private oldones?: NPCGroup;
  private photos?: NPCGroup;
  private chests: Chest[] = [];
  private items: Item[] = [];
  private portal?: Phaser.Physics.Arcade.Sprite;
  private soundDeath?: Phaser.Sound.BaseSound;
  private soundPickup?: Phaser.Sound.BaseSound;
  private soundTakedamage?: Phaser.Sound.BaseSound;
  private textAreYou?: Phaser.GameObjects.Text;
  private textLifes?: Phaser.GameObjects.Text;
  private textPhotos?: Phaser.GameObjects.Text;
  private collision: boolean;
  private pickup: boolean = false;
  private buttonContinue;
  private knownElements = {
    books: false,
    ghosts: false,
    holes: false,
    oldones: false,
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
    // soft reset to continue game
    this.pauseMovement = false;
    this.collision = false;
    this.pickup = false;
    // hard reset after death
    if (!data.knownElements) {
      this.knownElements = {
        books: false,
        ghosts: false,
        holes: false,
        oldones: false,
        player: false,
      };
    }
    if (!data.lifes) {
      this.lifes = 3;
    }
  }

  preload(): void {}

  create(): void {
    Helper.createFloor(this, TEXTURES.FLOOR);
    this._createAnimations();
    this._createControls();
    this._spawnChests(3, TEXTURES.CLOVER);
    // this._spawnBooks();
    this._spawnPhotos();
    // this._spawnHoles();
    // this._spawnGhosts();
    // this._spawnOldones();

    const { x, y } = Helper.createRandomCoords(this);
    this.player = new Player(this, x, y, TEXTURES.UNKNOWN, 0);
    this.player.play(TEXTURES.UNKNOWN);
    this.player.setCircle(14, 2, 2);

    this._addCollider();
    this.textLifes = this.add.text(10, 0, `Lifes: ${this.lifes}`, {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this.textPhotos = this.add.text(
      100,
      0,
      `Photos: ${this.photosCollected}/3`,
      {
        fontFamily: 'BitPotion',
        color: '#fff',
        fontSize: '28px',
      },
    );
    this.soundDeath = this.sound.add(AUDIO.DEATH);
    this.soundPickup = this.sound.add(AUDIO.PICKUP);
    this.soundTakedamage = this.sound.add(AUDIO.TAKEDAMAGE);
  }

  update(): void {
    this._movePlayer();

    if (!this.pauseMovement) {
      if (this.keyE.isDown || this.keyQ.isDown) {
        this.player.useClover(this);
      }
      this.player.updateCloverPosition();
    }
  }

  onCollisionCircleGhosts(circle, ghost) {
    this.ghosts.tmpReveal(ghost);
  }

  onCollisionCircleHoles(circle, hole) {
    this.holes.tmpReveal(hole);
  }

  onCollisionCircleBooks(circle, book) {
    this.books.tmpReveal(book);
  }

  onCollisionCircleOldones(circle, oldone) {
    this.oldones.tmpReveal(oldone);
  }

  onCollisionCirclePhotos(circle, photo) {
    this.photos.tmpReveal(photo);
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
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
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
        end: 1,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PLAYER_1,
      frames: this.anims.generateFrameNumbers(TEXTURES.PLAYER_1, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PLAYER_2,
      frames: this.anims.generateFrameNumbers(TEXTURES.PLAYER_2, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PLAYER_3,
      frames: this.anims.generateFrameNumbers(TEXTURES.PLAYER_3, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
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
    this.anims.create({
      key: TEXTURES.OLDONE,
      frames: this.anims.generateFrameNumbers(TEXTURES.OLDONE, {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PHOTO_D,
      frames: this.anims.generateFrameNumbers(TEXTURES.PHOTO_D, {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PHOTO_H,
      frames: this.anims.generateFrameNumbers(TEXTURES.PHOTO_H, {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PHOTO_O,
      frames: this.anims.generateFrameNumbers(TEXTURES.PHOTO_O, {
        start: 0,
        end: 5,
      }),
      frameRate: 5,
      repeat: -1, // -1: infinity
    });
    this.anims.create({
      key: TEXTURES.PORTAL,
      frames: this.anims.generateFrameNumbers(TEXTURES.PORTAL, {
        start: 0,
        end: 15,
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
      this.books,
      this._onCollisionPlayerBook,
      null,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.oldones,
      this._onCollisionPlayerOldone,
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
    this.physics.add.collider(
      this.player,
      this.photos,
      this._onCollisionPlayerPhoto,
      null,
      this,
    );
  }

  _spawnHoles() {
    this.holes = new NPCGroup(this.physics.world, this, {
      known: this.knownElements.holes,
      knownTexture: TEXTURES.HOLE,
      knownMoving: false,
      minQuantity: 5,
      maxQuantity: 12,
      velocity: this.velocity,
    });
  }

  _spawnGhosts() {
    this.ghosts = new NPCGroup(this.physics.world, this, {
      known: this.knownElements.ghosts,
      knownTexture: TEXTURES.GHOST,
      knownMoving: true,
      minQuantity: 5,
      maxQuantity: 12,
      velocity: this.velocity,
    });
  }

  _spawnBooks() {
    this.books = new NPCGroup(this.physics.world, this, {
      known: this.knownElements.books,
      knownTexture: TEXTURES.BOOKS,
      knownMoving: false,
      minQuantity: 5,
      maxQuantity: 12,
      velocity: this.velocity,
    });
  }

  _spawnOldones() {
    this.oldones = new NPCGroup(this.physics.world, this, {
      known: this.knownElements.oldones,
      knownTexture: TEXTURES.OLDONE,
      knownMoving: true,
      minQuantity: 3,
      maxQuantity: 7,
      velocity: this.velocity,
    });
  }

  _spawnPhotos() {
    this.photos = new NPCGroup(this.physics.world, this, {
      known: false,
      knownTexture: TEXTURES.PHOTO_D,
      knownMoving: false,
      minQuantity: 3,
      maxQuantity: 3,
      velocity: this.velocity,
    });
  }

  _spawnPortal() {
    const { x, y } = Helper.createRandomCoords(this);
    this.portal = this.physics.add.sprite(x, y, TEXTURES.PORTAL);
    this.portal.setImmovable(true);
    this.portal.play(TEXTURES.PORTAL);
    this.physics.add.collider(
      this.player,
      this.portal,
      this._onCollisionPlayerPortal,
      null,
      this,
    );
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

  _onCollisionPlayerGhost(
    player: Phaser.Physics.Arcade.Sprite,
    ghost: Phaser.Physics.Arcade.Sprite,
  ) {
    // collide only if no ongoing collision and player is moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    this.collision = true;
    this._takeDamage(ghost);
    if (!this.knownElements.ghosts) {
      this.knownElements.ghosts = true;
      this._zoomEffect(ghost);
    }
  }

  _onCollisionPlayerHole(
    player: Phaser.Physics.Arcade.Sprite,
    hole: Phaser.Physics.Arcade.Sprite,
  ) {
    // collide only if no ongoing collision and player is moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    this.collision = true;
    if (!this.knownElements.holes) {
      this.knownElements.holes = true;
      this._takeDamage(hole);
      this._zoomEffect(hole);
    } else {
      this._takeDamage(hole, 3);
    }
  }

  _onCollisionPlayerOldone(
    player: Phaser.Physics.Arcade.Sprite,
    oldone: Phaser.Physics.Arcade.Sprite,
  ) {
    // collide only if no ongoing collision and player is moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    this.collision = true;
    this._takeDamage(oldone);
    if (!this.knownElements.oldones) {
      this.knownElements.oldones = true;
      this._zoomEffect(oldone);
    }
  }

  _onCollisionPlayerBook(
    player: Phaser.Physics.Arcade.Sprite,
    book: Phaser.Physics.Arcade.Sprite,
  ) {
    // collide only if no ongoing collision and player is not moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    if (!this.knownElements.books) {
      this.collision = true;
      this.knownElements.books = true;
      this._zoomEffect(book);
    }
  }

  _onCollisionPlayerPhoto(
    player: Phaser.Physics.Arcade.Sprite,
    photo: Phaser.Physics.Arcade.Sprite,
  ) {
    // collide only if no ongoing collision and player is not moving
    if (
      this.collision ||
      (player.body.velocity.x == 0 && player.body.velocity.y == 0)
    )
      return;
    // collision is happening:
    this.photosCollected++;
    this.textPhotos.text = `Photos: ${this.photosCollected}/3`;
    this._zoomEffect(photo, true);
  }

  _onCollisionPlayerChest(player, chest) {
    // open if colliding an action button is pressed
    if (this.keyE.isDown || this.keyQ.isDown) {
      chest.open(this);
    }
  }

  _onCollisionPlayerPortal() {
    this.scene.start(SCENES.WINNING);
  }

  _onCollisionPlayerItem(player, item) {
    player.setPower(TEXTURES.CLOVER);
    this._pickupItem(item);
  }

  _pickupItem(item) {
    if (this.pickup) return;
    this.pickup = true;
    this.soundPickup.play();
    this._pickupItem(item);
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
      delay: 1000,
      callback: () => {
        item.destroy();
        this.pickup = false;
      },
      loop: false,
    });
  }

  _zoomEffect(element, bCollectItem = false) {
    if (this.pauseMovement) return;
    const bGameOver = this.lifes <= 0 ? true : false;
    this.soundDeath.play();
    this.pauseMovement = true;
    // this.holes.stop();
    // this.ghosts.stop();
    // this.books.stop();
    // this.oldones.stop();
    this.photos.stop();
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
        if (bGameOver) {
          Helper.textTypewriter(this, this.textAreYou, 'GameOver');
        } else {
          Helper.textTypewriter(this, this.textAreYou, 'Are you?');
        }
      },
      loop: false,
    });
    this.time.addEvent({
      delay: 1600,
      callback: () => {
        this.cameras.main.zoomTo(2.5, 700, 'Sine.easeOut');
        element.revealTexture(element);
        if (bGameOver) {
          Helper.createTextButton(
            this,
            this.player.x,
            this.player.y + 40,
            '< restart >',
            this._restart,
          );
          Helper.createTextButton(
            this,
            this.player.x,
            this.player.y + 80,
            '< main menu >',
            this._toMenu,
          );
        } else if (bCollectItem) {
          this.time.addEvent({
            delay: 1600,
            callback: () => {
              this._pickupItem(element);
              if (this.photosCollected == 1) {
                this.player.changeTexture(1);
              } else if (this.photosCollected == 2) {
                this.player.changeTexture(2);
              } else if (this.photosCollected == 3) {
                this.player.changeTexture(3);
                this._spawnPortal();
              }
              this.buttonContinue = Helper.createTextButton(
                this,
                this.player.x,
                this.player.y + 50,
                '< continue >',
                this._continue,
              );
            },
            loop: false,
          });
        } else {
          Helper.createTextButton(
            this,
            this.player.x,
            this.player.y + 50,
            '< go on >',
            this._goOn,
          );
        }
      },
      loop: false,
    });
  }

  _takeDamage(element, nDamage = 1) {
    this.soundTakedamage.play();
    this.lifes = this.lifes - nDamage;
    this.textLifes.text = `Lifes: ${this.lifes}`;
    if (this.lifes <= 0) {
      this._zoomEffect(element);
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

  _goOn(context) {
    context.scene.start(SCENES.GAME, {
      knownElements: context.knownElements,
      lifes: context.lifes,
    });
  }
  _continue(context) {
    context.pauseMovement = false;
    context.collision = false;
    context.pickup = false;
    context.buttonContinue.destroy();
    context.textAreYou.destroy();
    context.cameras.main.zoomTo(1, 700, 'Sine.easeOut');
    context.cameras.main.stopFollow();
    context.cameras.main.setScroll(0);

    // context.holes.resume();
    // context.ghosts.resume();
    // context.books.resume();
    // context.oldones.resume();
    // context.photos.resume();
  }
  _toMenu(context) {
    context.scene.start(SCENES.MENU);
  }
  _restart(context) {
    context.scene.start(SCENES.GAME, {});
  }

  //////////////////////////////////////////////////
  // Getter & Setter                              //
  //////////////////////////////////////////////////

  getGhosts() {
    return this.ghosts;
  }
  getHoles() {
    return this.holes;
  }
}
