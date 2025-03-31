export class ShipInventoryScene extends Phaser.Scene {
  width=400;
  height=400;
  x=0;
  y=400;
  cellWidth = 30;
  cellHeight = 30;
  gridSize = 30;
  grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(null));
  items = [];
  selectedItem = null;
  contextMenu = null;

  constructor() {
    super({ key: 'ShipInventoryScene' });
  }
  
  create() {
    // Create the inventory container
    const inventoryContainer = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
    this.setInteractive({
      hitArea: inventoryContainer,
      hitAreaStyle: Phaser.Geom.Rectangle.Contains,
      draggable: false,
    });
    
    const graphics = new Phaser.GameObjects.Graphics(scene);
    const inventoryMask = new Phaser.Display.Masks.GeometryMask(scene, graphics.fillRect(x, y, width/2, height));
    this.setMask(inventoryMask);
  
    this.scrollX = 0;
    this.scrollY = 0;
    this.scene.input.on('wheel', (pointer, deltaX, deltaY, deltaZ, event) => {
      this.scrollX += deltaX;
      this.scrollY += deltaY;
      this.scrollX = Phaser.Math.Clamp(this.scrollX, 0, (this.gridSize - width / cellWidth) * cellWidth);
      this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, (this.gridSize - height / cellHeight) * cellHeight);
      this.updateGridDisplay();
    });
  }  

  createGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.scene.add.rectangle(
          j * this.cellWidth,
          i * this.cellHeight,
          this.cellWidth,
          this.cellHeight,
          0x333333,
          0.1
        ).setOrigin(0);
        cell.i = i;
        cell.j = j;
        this.add(cell);
        cell.setInteractive();
        cell.on('pointerover', () => {
          if (!this.grid[i][j]) {
            this.scene.input.setDefaultCursor('default');
          }
        });
      }
    }
  }

  addItem(item, x, y) {
    const itemWidth = item.width * this.cellWidth;
    const itemHeight = item.height * this.cellHeight;

    if (this.canPlaceItem(x, y, item.width, item.height)) {
      item.x = x * this.cellWidth;
      item.y = y * this.cellHeight;
      this.add(item);
      this.items.push(item);

      for (let i = y; i < y + item.height; i++) {
        for (let j = x; j < x + item.width; j++) {
          this.grid[i][j] = item;
        }
      }

      item.setInteractive();
      item.on('pointerover', () => {
        this.scene.input.setDefaultCursor('pointer');
      });

      item.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown()) {
          this.showContextMenu(item, pointer.x, pointer.y);
        } else {
          this.selectedItem = item;
          this.scene.input.setDefaultCursor('grab');
          this.highlightItemPosition(item);
          item.setDepth(10);
        }
      });

      item.on('pointerup', (pointer) => {
        if (this.selectedItem === item) {
          this.dropItem(item, pointer.x + this.scrollX, pointer.y + this.scrollY);
          this.selectedItem = null;
          this.scene.input.setDefaultCursor('default');
          this.clearHighlight();
        }
      });

      item.on('pointermove', (pointer) => {
        if (this.selectedItem === item) {
          item.x = pointer.x - itemWidth / 2 + this.scrollX;
          item.y = pointer.y - itemHeight / 2 + this.scrollY;
        }
      });

      this.updateGridDisplay();
      return true;
    }
    return false;
  }

  canPlaceItem(x, y, width, height) {
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        if (i >= this.gridSize || j >= this.gridSize || this.grid[i][j] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  dropItem(item, x, y) {
    const gridX = Math.floor(x / this.cellWidth);
    const gridY = Math.floor(y / this.cellHeight);

    this.removeItemFromGrid(item);
    if (this.canPlaceItem(gridX, gridY, item.width, item.height)) {
      item.x = gridX * this.cellWidth;
      item.y = gridY * this.cellHeight;

      for (let i = gridY; i < gridY + item.height; i++) {
        for (let j = gridX; j < gridX + item.width; j++) {
          this.grid[i][j] = item;
        }
      }
    } else {
      item.x = item.initialX;
      item.y = item.initialY;

      for (let i = item.initialY / this.cellHeight; i < item.initialY / this.cellHeight + item.height; i++) {
        for (let j = item.initialX / this.cellWidth; j < item.initialX / this.cellWidth + item.width; j++) {
          this.grid[i][j] = item;
        }
      }
    }

    this.updateGridDisplay();
  }

  removeItemFromGrid(item) {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.grid[i][j] === item) {
          this.grid[i][j] = null;
        }
      }
    }
  }

  highlightItemPosition(item) {
    const x = item.x / this.cellWidth;
    const y = item.y / this.cellHeight;

    for (let i = y; i < y + item.height; i++) {
      for (let j = x; j < x + item.width; j++) {
        this.getAt(i * this.gridSize + j).fillColor = 0x555588;
        this.getAt(i * this.gridSize + j).fillAlpha = 0.7;
      }
    }
  }

  clearHighlight() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.getAt(i * this.gridSize + j).fillColor = 0x333333;
        this.getAt(i * this.gridSize + j).fillAlpha = 0.1;
      }
    }
  }

  showContextMenu(item, x, y) {
    if (this.contextMenu) {
      this.contextMenu.destroy();
    }

    this.contextMenu = this.scene.add.text(x, y, 'Power: 10', {
      backgroundColor: '#222',
      padding: { x: 10, y: 5 },
    }).setOrigin(0);

    this.contextMenu.setInteractive();
    this.contextMenu.on('pointerdown', () => {
      this.contextMenu.destroy();
      this.contextMenu = null;
    });
  }

  updateGridDisplay(){
    this.list.forEach((child) => {
      child.x = child.j* this.cellWidth - this.scrollX;
      child.y = child.i* this.cellHeight - this.scrollY;
    });
    this.items.forEach((item) => {
      item.x = (item.x / this.cellWidth) * this.cellWidth - this.scrollX;
      item.y = (item.y / this.cellHeight) * this.cellHeight - this.scrollY;
    });
  }
}