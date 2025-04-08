import { ShipInventory } from '@/scenes/spaceship/ShipInventory';
import { ShipPreviewScene } from '@/scenes/spaceship/ShipPreviewScene';
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
    // const previewScene = new ShipPreviewScene();
    // this.scene.add('ShipPreviewScene', previewScene, true);
  }

  cleanup() {
    this.children.removeAll();
  }
}
