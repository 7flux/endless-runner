import './spaceship-equipment.css';
// TODO: REMOVE. same as in scenes/spaceship/ShipInventoryScene.js
const equipments = {
  weapons: [
    {
      name: 'rocket launcher',
      damage: '40',
      lightArmorK: '1',
      heavyArmorK: '1.2'
    }
  ],
  navigation: [
    {
      name: 'radar',
      power: '1100',
      type: 'nano'
    },
    {
      name: 'scanner',
      power: '11',
      type: 'nano'
    }
  ],
  engine: [
    {
      name: 'engine',
      power: '1000'
    },
    {
      name: 'fuel',
      capacity: '30',
    }
  ]
};

export class SpaceshipEquipmentScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SpaceshipEquipmentScene' });
  }

  preload() {
    this.load.image('spaceship-equipment-background', 'assets/spaceship/spaceship-equipment.png');
  }
  
  create() {
    this.add.image(0, 0, "spaceship-equipment-background").setOrigin(0, 0).setSize(800, 400);
    // Create the menu container
    const menu = this.add.container(0, 0);
    menu.setName('spaceship-equipment-overlay');

    // Create the equipment container
    const equipmentContainer = this.add.container(0, 0);
    equipmentContainer.setName('spaceship-equipment');

    // Create the inventory container
    const inventoryContainer = this.add.container(0, 400);
    inventoryContainer.setName('inventory-container');

    // Create the inventory grid
    const inventoryGrid = this.add.grid(0, 0, 400, 400, 30, 30, 0xf03300, 0.5).setOrigin(0, 0);
    inventoryGrid.setName('inventory-grid');

    // Create the inventory preview
    const inventoryPreview = this.add.container(0, 0);
    inventoryPreview.setName('inventory-preview');

    // Generate 30 inventory items
    for (let i = 1; i <= 100; i++) {
      const item = this.add.text(0, i * 20, `${i}`, {
        fontSize: '16px',
        color: i < 7 ? '#00ff00' : '#ff0000'
      });

      if (i < 7) {
        item.setName('inventory-item-active');
      } else {
        item.setName('inventory-item-empty');
      }

      inventoryGrid.add(item);
    }

    // Add inventory grid and preview to the inventory container
    inventoryContainer.add([inventoryGrid, inventoryPreview]);

    // Add equipment and inventory containers to the menu
    menu.add([equipmentContainer, inventoryContainer]);

    // Add the menu to the scene
    this.add.existing(menu);
  }

  cleanup() {
    this.children.removeAll();
  }
}
