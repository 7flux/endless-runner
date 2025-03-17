import { Game } from "phaser";
import { Preloader } from "./preloader.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { HudScene } from "./scenes/HudScene.js";
import { MainScene } from "./scenes/MainScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { SplashScene } from "./scenes/SplashScene.js";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 960,
    height: 540,
    backgroundColor: "#1c172e",
    pixelArt: true,
    roundPixel: false,
    max: {
        width: 800,
        height: 600,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
        GameOverScene
    ]
};

new Game(config);