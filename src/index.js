import Phaser from 'phaser'
import { MenuScene } from '@/MenuScene';
import { GameScene } from '@/GameScene';

export const dimensions = {
  mobile: {
    width: 600,
    height: 800
  },
  full: {
    width: 1920,
    height: 1080,
  }
}

const config = {
  type: Phaser.AUTO,
  width: dimensions.full.width,
  height: dimensions.full.height,
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

