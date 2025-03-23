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
}


export class SpaceshipEquipment {
  static menu;

  constructor() {
    // TODO: image of a spaceship should be horizontal, faces right direction
  };
  
  static create() {
    // TODO: let it handle menu cache
    if (SpaceshipEquipment.menu) SpaceshipEquipment.cleanup(); 

    const menu = document.createElement('div');
    this.menu = menu;
    menu.className = 'spaceship-equipment-overlay';
    
    const equipmentContainer = document.createElement('div');
    equipmentContainer.className = 'spaceship-equipment';
    
    for (let weapon in equipments.weapons) {
      
    }
    
    
    const inventoryContainer = document.createElement('div');
    const inventoryGrid = document.createElement('div');
    
    inventoryContainer.className = 'inventory-container';
    inventoryGrid.className = 'inventory-grid';

    // Generate 30 inventory items
    for (let i = 1; i <= 100; i++) {
      const item = document.createElement("div");
      // TODO: different sizes
      if (i < 7) {
        item.classList.add("inventory-item", "active");
      } else {
        item.classList.add("inventory-item", "empty");
      }

      item.innerHTML = `<p>${i}</p>`; // Number for now, can replace with icons
      inventoryGrid.appendChild(item);
    }
    
    document.body.appendChild(menu);
    inventoryContainer.appendChild(inventoryGrid);
    menu.appendChild(equipmentContainer);
    menu.appendChild(inventoryContainer);
  }

  static cleanup() {
    this.menu.remove();
  }
}
