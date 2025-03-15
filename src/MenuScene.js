export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
  }

  create() {
    this.add.text(300, 100, 'Space Invaders', { fontSize: '48px', fill: '#fff' });

    let startButton = this.add.text(350, 250, 'Start Game', { fontSize: '32px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.scene.start('GameScene'));
    
    let optionsButton = this.add.text(350, 300, 'Options', { fontSize: '32px', fill: '#fff' })
      .setInteractive()
      .on('pointerdown', () => this.showOptions());
  }

  showOptions() {
    console.log("Opening options...");
    // Handle options menu, like volume, difficulty, etc.
  }
}
