import { createMenu } from './components/menu/createMenu';

// Menu Scene: Main menu with options
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    createMenu();
  }

  preload() {
    this.load.image('playButton', 'assets/playButton.png');
    this.load.image('background', 'assets/stars.png'); // background stars
  }

  create() {
    // Add background stars
    this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0, 0);
    
    // Create Play button
    let playButton = this.add.image(400, 300, 'playButton').setInteractive();
    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Add options button or text here (if needed)
    this.add.text(350, 500, 'Options', { fontSize: '24px', fill: '#fff' }).setInteractive().on('pointerdown', () => {
      this.openOptions();
    });
  }

  openOptions() {
    console.log("Opening options menu...");
    // You can show a UI to change options here (like sound, difficulty, etc.)
  }
}
