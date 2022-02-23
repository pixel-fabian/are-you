import 'phaser';
import SceneLoad from './scenes/sceneLoad';
import SceneMenu from './scenes/sceneMenu';
import SceneGame from './scenes/sceneGame';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL if available
  title: 'Are You?',
  width: 800,
  height: 640,
  parent: 'game',
  scene: [SceneLoad, SceneMenu, SceneGame],
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 0,
      },
    },
  },
};

window.onload = () => {
  new Phaser.Game(config);
};
