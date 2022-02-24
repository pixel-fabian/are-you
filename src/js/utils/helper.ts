export default class Helper {
  /**
   * Create random coordinates within the scene
   *
   * @param scene Scene
   * @returns
   */
  static createRandomCoords(scene: Phaser.Scene) {
    // width and height of the game screen
    const width = scene.scale.width;
    const height = scene.scale.height;

    const x = Phaser.Math.Between(0, width - 16);
    const y = Phaser.Math.Between(0, height - 16);

    return { x, y };
  }

  /**
   * Create floor with 32x32 tiles
   *
   * @param scene
   * @param sTextureKey
   */
  static createFloor(scene: Phaser.Scene, sTextureKey: string) {
    const aLevel = [];
    const nRows = scene.scale.height / 32;
    const nColumns = scene.scale.width / 32;
    // create 2D array with random tile numbers
    for (let rowIndex = 0; rowIndex < nRows; rowIndex++) {
      const aRow = [];
      for (let columnIndex = 0; columnIndex < nColumns; columnIndex++) {
        const nTile = Phaser.Math.Between(0, 3);
        aRow.push(nTile);
      }
      aLevel.push(aRow);
    }
    // When loading from an array, make sure to specify the tileWidth and tileHeight
    const map = scene.make.tilemap({
      data: aLevel,
      tileWidth: 32,
      tileHeight: 32,
    });
    const tiles = map.addTilesetImage(sTextureKey);
    map.createLayer(0, tiles, 0, 0);
  }
}
