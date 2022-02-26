export default class Item extends Phaser.Physics.Arcade.Sprite {
  /**
   *
   * @param scene
   * @param x
   * @param y
   * @param texture
   */
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
  }
}
