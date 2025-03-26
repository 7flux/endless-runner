export class ShipInventoryScene extends Phaser.Scene {
  constructor() {
    super('ShipInventoryScene');
  }

  preload() {
    this.load.image('spaceship-preview', '@/assets/skies/space3.png');
  }

  create() {
    this.add.image(0, 0, 'spaceship-preview').setOrigin(0, 0).setSize(800, 400);
    this.add.bitmapText(10, 10, 'pixelfont', 'Ship Inventory', 24);
    this.add.bitmapText(10, 50, 'pixelfont', 'Equipments:', 24);

    // Add your spaceship equipment UI here
    
    // Example: SpaceshipEquipment.create(this);
  }
}