export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    console.log('preloading')
  }

  create() {
    let startButton = this.add.text(250, 250, 'Start Game', { fontSize: '32px', fill: '#fff' })
      .setInteractive()
      .on('pointerover', () => {
        startButton.setColor('#dddddd')
        this.input.setDefaultCursor('pointer');
      })
      .on('pointerout', () => {
        startButton.setColor('#fff')
        this.input.setDefaultCursor('default');
      })
      .on('pointerdown', () => {
        startButton.setColor('#fff')
        this.scene.start('GameScene')
      });
    
    let inventoryDebug = this.add.text(250, 200, 'Debug inventory', { fontSize: '32px', fill: '#fff' })
      .setInteractive()
      .on('pointerover', () => {
        inventoryDebug.setColor('#dddddd')
        this.input.setDefaultCursor('pointer');
      })
      .on('pointerout', () => {
        inventoryDebug.setColor('#fff')
        this.input.setDefaultCursor('default');
      })
      .on('pointerdown', () => {
        inventoryDebug.setColor('#fff')
        this.scene.start('MainScene')
      });
  }

  showOptions() {
    console.log("Opening options...");
    // Handle options menu, like volume, difficulty, etc.
  }
}
