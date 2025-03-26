import { Game } from "phaser";
import { Preloader } from "@/preloader.js";
import { GameOverScene } from "@/scenes/GameOverScene.js";
import { HudScene } from "@/scenes/HudScene.js";
import { MainScene } from "@/scenes/MainScene.js";
import { MenuScene } from "@/scenes/MenuScene.js";
import { SplashScene } from "@/scenes/SplashScene.js";
import { ShipPreviewScene } from "@/scenes/spaceship/ShipPreviewScene.js";
import { ShipInventoryScene } from "@/scenes/spaceship/ShipInventoryScene.js";
import { SpaceshipEquipmentScene } from "@/scenes/spaceship/SpaceshipEquipmentScene";
import '@/index.css'

export const sharedConfig = {
  phaserContainerName: 'phaser-container'
}

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
/** @type {Phaser.Types.Core.GameConfig} */
const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#1c172e",
  pixelArt: true,
  roundPixel: false,
  clearBeforeRender: false,
  max: {
    width: 800,
    height: 600,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [
    Preloader,
    SplashScene,
    MainScene,
    MenuScene,
    HudScene,
    GameOverScene,
    ShipPreviewScene,
    ShipInventoryScene,
    // SpaceshipEquipmentScene,
  ]
};

export function createGame() {
  const game = new Game(config);
  return game;
}

export function destroyGame(game) {
  if (game) {
      console.log('Destroying game instance...');
      game.destroy(true); // Destroy the game and remove the canvas
      const container = document.getElementById(sharedConfig.phaserContainerName);
      if (container) {
        container.innerHTML = '';
      }
  }
}
