import './spaceship-equipment.css';

export class SpaceshipEquipment {
  static menu;

  constructor() {};
  
  static create() {
    // TODO: let it handle menu cache
    if (SpaceshipEquipment.menu) SpaceshipEquipment.cleanup(); 

    const menu = document.createElement('div');
    this.menu = menu;
    menu.className = 'spaceship-equipment-overlay';
    document.body.appendChild(menu);

  }

  static cleanup() {
    this.menu.remove();
  }
}
