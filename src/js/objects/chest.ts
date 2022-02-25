export default class Chest extends Phaser.Physics.Arcade.Sprite {
  /**
   * item inside the chest
   */
  private item: string;

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
    texture: string | Phaser.Textures.Texture,
    item?: string,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    if (item) {
      this.item = item;
    }
  }

  open() {
    console.log('open chest', this.item);
  }
}
