import Phaser from 'phaser';

import { MenuScene } from './MenuScene';
import { GameScene } from './GameScene';

// import PlayScene from './PlayScene';
// import PreloadScene from './PreloadScene';

const config = {
  type: Phaser.AUTO,
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, GameScene],
  
  // pixelArt: true,
  // transparent: true,
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     debug: false
  //   }
  // },
  // scene: [PreloadScene, PlayScene]
};

new Phaser.Game(config);
