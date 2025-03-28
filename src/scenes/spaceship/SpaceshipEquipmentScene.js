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
    // const menu = this.add.container(0, 0);
    // menu.setName('spaceship-equipment-overlay');

    // // Create the equipment container
    // const equipmentContainer = this.add.container(0, 0);
    // equipmentContainer.setName('spaceship-equipment');

    // // Create the inventory container
    // const inventoryContainer = this.add.container(0, 400);
    // inventoryContainer.setName('inventory-container');

    // // Create the inventory grid
    // const inventoryGrid = this.add.grid(0, 0, 400, 400, 30, 30, 0xf03300, 0.5).setOrigin(0, 0);
    // inventoryGrid.setName('inventory-grid');


    const tileSize = 50;
    const rows = 10;
    const cols = 12;
    const gridWidth = cols * tileSize + 10*cols;
    const gridHeight = rows * tileSize + 10*rows;

    // Create a container to hold all tiles
    this.gridContainer = this.add.container(0, 400);

    // Generate grid tiles
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * tileSize;
            const y = row * tileSize;

            const tile = this.add.rectangle(x, y, tileSize, tileSize, 0x222222, 1).setOrigin(0);
            tile.setStrokeStyle(1, 0x8855ff);
            
            // Add tile to the container
            this.gridContainer.add(tile);
        }
    }

    // Set container size based on grid size
    this.gridContainer.setSize(gridWidth, gridHeight);

    // Enable scrolling using the camera
    this.cameras.main.setBounds(0, 0, gridWidth, gridHeight);
    this.cameras.main.startFollow(this.gridContainer);

    // Enable input drag to move the grid
    this.input.on('pointermove', (pointer) => {
        console.log(pointer)
        if (pointer.isDown) {
            this.cameras.main.scrollX -= (pointer.velocity.x / 10);
            this.cameras.main.scrollY -= (pointer.velocity.y / 10);
        }
    });




    // // Create the inventory preview
    // const inventoryPreview = this.add.container(0, 0);
    // inventoryPreview.setName('inventory-preview');

    // // Add inventory grid and preview to the inventory container
    // inventoryContainer.add([inventoryGrid, inventoryPreview]);

    // // Add equipment and inventory containers to the menu
    // menu.add([equipmentContainer, inventoryContainer]);

    // // Add the menu to the scene
    // this.add.existing(menu);
  }

  cleanup() {
    this.children.removeAll();
  }
}
