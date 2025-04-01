export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
  }

  create() {
    let startButton = this.add.text(350, 250, 'Start Game', { fontSize: '32px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.scene.start('GameScene')); // add scene
  }

  showOptions() {
    console.log("Opening options...");
    // Handle options menu, like volume, difficulty, etc.
  }
}
