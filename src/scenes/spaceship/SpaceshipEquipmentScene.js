import { ShipInventory } from '@/scenes/spaceship/ShipInventory';
import { ShipPreview } from '@/scenes/spaceship/ShipPreview';
import './spaceship-equipment.css';

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

  preload() {}
  
  create() {
    this.shipInventory = new ShipInventory(this, 0, 400);
    // this.shipInventory.container.setVisible(false)
    const previewScene = new ShipPreview(this, 0, 0);
    // this.scene.add('ShipPreviewScene', previewScene, true);
  }

  cleanup() {
    this.children.removeAll();
  }
}
