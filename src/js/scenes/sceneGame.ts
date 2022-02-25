import 'phaser';
import SCENES from '../constants/SceneKeys';
import TEXTURES from '../constants/TextureKeys';
import AUDIO from '../constants/AudioKeys';
import Helper from '../utils/helper';
import Player from '../objects/player';
import Enemies from '../objects/enemies';

export default class SceneGame extends Phaser.Scene {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private velocity = 90;
  private lifes = 3;
  private pauseMovement = false;
  private player?: Player;
  private holes?: Enemies;
  private ghosts?: Enemies;
  private soundDeath?: Phaser.Sound.BaseSound;
  private textAreYou?: Phaser.GameObjects.Text;
  private textLifes?: Phaser.GameObjects.Text;
  private collision: boolean;
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
    console.log(this);

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
    this.textLifes = this.add.text(10, 0, `Lifes: ${this.lifes}`, {
      fontFamily: 'BitPotion',
      color: '#fff',
      fontSize: '28px',
    });
    this.soundDeath = this.sound.add(AUDIO.DEATH);
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

  _onCollisionPlayerHole(player, hole) {
    if (this.collision) return;
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
    if (this.collision) return;
    this.collision = true;
    if (!this.knownElements.ghosts) {
      this.knownElements.ghosts = true;
      this._revealElement(ghost);
    } else {
      this._looseLife();
    }
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
        delay: 200,
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
