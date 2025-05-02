// TODO: move to object imports
import { ShipInventory } from '@/scenes/spaceship/ShipInventory'; 
import { ShipPreview } from '@/scenes/spaceship/ShipPreview';
import './spaceship-equipment.css';


export class SpaceshipEquipmentScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SpaceshipEquipmentScene' });
  }

  preload() {
    this.load.image('spaceship-equipment-background', 'spaceship/spaceship-equipment.png');
  }

  create() {
    this.previewScene = new ShipPreview(this, 0, 0); // TODO: either move equipment code here or remove completely
    this.shipInventory = new ShipInventory(this, 0, this.scale.height / 2);

    // this.shipInventory.container.setVisible(false)
    // this.scene.add('ShipPreviewScene', previewScene, true);
  }

  cleanup() {
    this.children.removeAll();
  }
}
