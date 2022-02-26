import AUDIO from '../constants/AudioKeys';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  /**
   * Item inside the chest
   */
  private item: string;
  /**
   * Texture when chest is open
   */
  private textureOpen: string;
  /**
   * Chest is open?
   */
  private opened: boolean;
  /**
   * Sound when opening chest
   */
  private soundOpen: Phaser.Sound.BaseSound;

  /**
   *
   * @param scene
   * @param x
   * @param y
   * @param texture
   * @param item
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureClosed: string,
    textureOpen: string,
    item?: string,
  ) {
    super(scene, x, y, textureClosed);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.soundOpen = scene.sound.add(AUDIO.OPEN);
    if (item) {
      this.item = item;
    }
    if (textureOpen) {
      this.textureOpen = textureOpen;
    }
  }

  open() {
    if (this.opened) return;
    this.soundOpen.play();
    this.opened = true;
    console.log('open chest', this.item);
    this.setTexture(this.textureOpen);
  }
}
