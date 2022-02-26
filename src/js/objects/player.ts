import TEXTURES from '../constants/TextureKeys';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private hasPowerClover = false;
  private usePowerClover = false;
  private timerPowerClover = 0;
  private circlePowerClover?;
  private iconPowerClover?;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setDepth(100);
  }

  setPower(sPower) {
    switch (sPower) {
      case TEXTURES.CLOVER:
        this.hasPowerClover = true;
        this.iconPowerClover = this.scene.add.rectangle(
          780,
          20,
          35,
          35,
          0x331c18,
        );
        this.iconPowerClover.setStrokeStyle(2, 0xffffff);
        this.scene.add.image(779, 20, TEXTURES.CLOVER);
        break;
    }
  }

  useClover() {
    if (
      !this.hasPowerClover ||
      this.timerPowerClover > 0 ||
      this.usePowerClover
    )
      return;
    this.usePowerClover = true;
    this.iconPowerClover.setStrokeStyle(2, 0xefc53f);
    this.circlePowerClover = this.scene.add.circle(
      this.x,
      this.y,
      70,
      0x6abe30,
    );
    this.circlePowerClover.setAlpha(0.2);
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        this.usePowerClover = false;
        this.circlePowerClover.destroy(this.scene);
        this.iconPowerClover.setStrokeStyle(2, 0x666666);
        this.timerPowerClover = 20;
        this._countDownCirclePower(this.timerPowerClover);
      },
      loop: false,
    });
  }

  updateCloverPosition() {
    if (this.usePowerClover) {
      this.circlePowerClover.x = this.x;
      this.circlePowerClover.y = this.y;
    }
  }

  _countDownCirclePower(duration) {
    this.scene.time.addEvent({
      callback: () => {
        this.timerPowerClover--;
        if (this.timerPowerClover == 0) {
          this.iconPowerClover.setStrokeStyle(2, 0xffffff);
        }
      },
      repeat: duration - 1,
      delay: 1000,
    });
  }
}
