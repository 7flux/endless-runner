class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('bullet', 'assets/bullet.png');
  }

  create() {
    // Add background stars (space effect)
    this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0, 0);

    // Create player and enemies here (same as before)
    this.player = this.physics.add.image(400, 550, 'player').setOrigin(0.5, 0.5);
    // Other game objects (bullets, enemies) as needed
  }

  update() {
    // Game update logic (player movement, shooting, enemy AI)
  }
}