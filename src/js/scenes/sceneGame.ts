import 'phaser';
import SCENES from '../constants/SceneKeys';
export default class SceneGame extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME,
    });
  }

  //////////////////////////////////////////////////
  // LIFECYCLE (init, preload, create, update)    //
  //////////////////////////////////////////////////

  init(): void {
  }

  preload(): void { }

  create(): void {
    this.add.text(350, 300, 'Hello World', { fontFamily: 'sans-serif', color: '#fff' });
  }

  update(): void { }

  //////////////////////////////////////////////////
  // Private methods                              //
  //////////////////////////////////////////////////
}
