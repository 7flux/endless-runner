export class ShipInventoryScene extends Phaser.Scene {
  width=400;
  height=400;
  x=0;
  y=400;
  cellWidth=30;
  cellHeight=30;
  grid = Array(30).fill(null).map(() => Array(7).fill(null));

  items = [{
    name: 'Ion Cannon',
    properties: {
      type: 'Weapon',
      weight: 10,
      size: [1, 3],
      description: 'Description of Item 1',
      fireRate: 1,
      damage: 10,
      range: 100,
      speed: 5,
    }
  },{
    name: 'Thruster',
    properties: {
      type: 'Engine',
      weight: 10,
      size: [3, 3],
      description: 'Description of Item 2',
      speed: 5,
      fuelConsumption: 1,
      thrust: 10,
    }
  }];

  constructor() {
    super({ key: 'ShipInventoryScene' });
  }
  
  preload() {
    // No assets to preload for now
  }

  create() {
    // Create the inventory container
    this.inventoryContainer = this.add.container(this.x, this.y);
    
    // Create grid background
    this.createGrid();
    
    // Place items in the grid
    this.placeItemsInGrid();
    
    // // Create preview panel
    // this.createPreviewPanel();
    
    // // Set up scrolling
    // this.setupScrolling();

    console.log(this)
  }

  createGrid() {
    // Create temporary graphics for grid
    const gridGraphics = this.add.graphics();
    
    // Generate a texture from a single cell for better performance
    gridGraphics.clear();
    gridGraphics.lineStyle(1, 0x44ff88, 1);
    gridGraphics.strokeRect(0, 0, this.cellWidth, this.cellHeight);
    gridGraphics.generateTexture('gridCellTexture', this.cellWidth, this.cellHeight);

    // Create a tiled sprite using the cell texture
    this.gridSprite = this.add.tileSprite(
      this.x, this.y,
      7 * this.cellWidth, 30 * this.cellHeight,
      'gridCellTexture'
    );
    
    // Create a sprite using the generated texture
    this.gridSprite = this.add.sprite(this.x, this.y, 'gridTexture');
    this.gridSprite.setOrigin(0, 0);
    
    // Add the sprite to the container
    this.inventoryContainer.add(this.gridSprite);
    
    // Destroy the temporary graphics object
    // gridGraphics.destroy();
  }

  placeItemsInGrid() {
    this.itemSprites = [];
    
    // Place items in the grid
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const [width, height] = item.properties.size;
      
      // Find a free space in the grid
      const position = this.findFreeGridSpace(width, height);
      
      if (position) {
        const [gridX, gridY] = position;

        // Create item visual
        const itemGraphics = this.add.graphics();
        itemGraphics.fillStyle(0x0000ff, 0.5);
        itemGraphics.fillRect(
          gridX * this.cellWidth, 
          gridY * this.cellHeight, 
          width * this.cellWidth, 
          height * this.cellHeight
        );
        
        // Store item in grid
        for (let y = gridY; y < gridY + height; y++) {
          for (let x = gridX; x < gridX + width; x++) {
            if (y < 30 && x < 7) {
              this.grid[y][x] = { item, gridX, gridY, width, height };
            }
          }
        }
        
        // Add text label
        const text = this.add.text(
          gridX * this.cellWidth + 5, 
          gridY * this.cellHeight + 5, 
          item.name, 
          { fontSize: '12px', fill: '#fff', wordWrap: { width: width * this.cellWidth - 10 } }
        );
        
        // Group item graphics and text
        const itemGroup = this.add.container(0, 0, [itemGraphics, text]);
        
        // Make item interactive
        itemGroup.setInteractive(new Phaser.Geom.Rectangle(
          gridX * this.cellWidth, 
          gridY * this.cellHeight, 
          width * this.cellWidth, 
          height * this.cellHeight
        ), Phaser.Geom.Rectangle.Contains);
        
        // Hover effects
        itemGroup.on('pointerover', () => {
          this.input.setDefaultCursor('pointer');
          itemGraphics.clear();
          itemGraphics.fillStyle(0x3333ff, 0.7);
          itemGraphics.fillRect(
            gridX * this.cellWidth, 
            gridY * this.cellHeight, 
            width * this.cellWidth, 
            height * this.cellHeight
          );
        });
        
        itemGroup.on('pointerout', () => {
          this.input.setDefaultCursor('default');
          itemGraphics.clear();
          itemGraphics.fillStyle(0x0000ff, 0.5);
          itemGraphics.fillRect(
            gridX * this.cellWidth, 
            gridY * this.cellHeight, 
            width * this.cellWidth, 
            height * this.cellHeight
          );
        });

        // Click for preview and drag
        itemGroup.on('pointerdown', () => {
          this.showItemPreview(item);
          this.input.setDraggable(itemGroup);
        });

        this.inventoryContainer.add(itemGroup);
        this.itemSprites.push({ item, graphics: itemGraphics, text, container: itemGroup, gridPosition: position });
      }
    }
    
    this.setupDragAndDrop();
  }

  findFreeGridSpace(width, height) {
    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 7 - width + 1; x++) {
        let free = true;
        
        for (let dy = 0; dy < height && free; dy++) {
          for (let dx = 0; dx < width && free; dx++) {
            if (this.grid[y + dy][x + dx] !== null) {
              free = false;
            }
          }
        }
        
        if (free) return [x, y];
      }
    }
    return null;
  }

  createPreviewPanel() {
    this.previewPanel = this.add.container(7 * this.cellWidth + 20, 0);
    
    const bg = this.add.graphics();
    bg.fillStyle(0x222222, 0.8);
    bg.fillRect(0, 0, 200, 400);
    this.previewPanel.add(bg);
    
    this.previewTitle = this.add.text(10, 10, 'Item Preview', { fontSize: '18px', fill: '#fff' });
    this.previewDetails = this.add.text(10, 40, '', { fontSize: '14px', fill: '#fff', wordWrap: { width: 180 } });
    
    this.previewPanel.add([this.previewTitle, this.previewDetails]);
  }

  showItemPreview(item) {
    this.previewTitle.setText(item.name);
    
    let details = `Type: ${item.properties.type}\n`;
    details += `Size: ${item.properties.size[0]}x${item.properties.size[1]}\n`;
    details += `Weight: ${item.properties.weight}\n\n`;
    details += item.properties.description + '\n\n';
    
    // Type-specific properties
    if (item.properties.type === 'Weapon') {
      details += `Damage: ${item.properties.damage}\n`;
      details += `Fire Rate: ${item.properties.fireRate}\n`;
      details += `Range: ${item.properties.range}\n`;
    } else if (item.properties.type === 'Engine') {
      details += `Thrust: ${item.properties.thrust}\n`;
      details += `Speed: ${item.properties.speed}\n`;
      details += `Fuel Consumption: ${item.properties.fuelConsumption}\n`;
    }
    
    this.previewDetails.setText(details);
  }

  setupDragAndDrop() {
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    
    this.input.on('dragend', (pointer, gameObject) => {
      const item = this.itemSprites.find(sprite => sprite.container === gameObject);
      
      if (item) {
        const gridX = Math.floor((gameObject.x - this.x) / this.cellWidth);
        const gridY = Math.floor((gameObject.y - this.y) / this.cellHeight);
        
        if (this.isValidPlacement(item.item, gridX, gridY, item.gridPosition)) {
          // Clear old position
          const [oldX, oldY] = item.gridPosition;
          const [width, height] = item.item.properties.size;
          
          for (let y = oldY; y < oldY + height; y++) {
            for (let x = oldX; x < oldX + width; x++) {
              if (y < 30 && x < 7) this.grid[y][x] = null;
            }
          }
          
          // Add to new position
          for (let y = gridY; y < gridY + height; y++) {
            for (let x = gridX; x < gridX + width; x++) {
              if (y < 30 && x < 7) {
                this.grid[y][x] = { item: item.item, gridX, gridY, width, height };
              }
            }
          }
          
          item.gridPosition = [gridX, gridY];
          gameObject.x = this.x + gridX * this.cellWidth;
          gameObject.y = this.y + gridY * this.cellHeight;
        } else {
          // Return to original position
          gameObject.x = this.x + item.gridPosition[0] * this.cellWidth;
          gameObject.y = this.y + item.gridPosition[1] * this.cellHeight;
        }
      }
    });
  }

  isValidPlacement(item, gridX, gridY, currentPos) {
    const [width, height] = item.properties.size;
    const [currentX, currentY] = currentPos;
    
    // Check bounds
    if (gridX < 0 || gridY < 0 || gridX + width > 7 || gridY + height > 30) {
      return false;
    }
    
    // Check for collisions
    for (let y = gridY; y < gridY + height; y++) {
      for (let x = gridX; x < gridX + width; x++) {
        const isCurrentCell = x >= currentX && x < currentX + width && 
                             y >= currentY && y < currentY + height;
        
        if (!isCurrentCell && this.grid[y][x] !== null) {
          return false;
        }
      }
    }
    
    return true;
  }

  setupScrolling() {
    const mask = this.add.graphics();
    mask.fillStyle(0xffffff);
    mask.fillRect(this.x, this.y, 7 * this.cellWidth, this.height);
    
    this.inventoryContainer.mask = new Phaser.Display.Masks.GeometryMask(this, mask);
    
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.x && pointer.x <= this.x + 7 * this.cellWidth &&
          pointer.y >= this.y && pointer.y <= this.y + this.height) {
        this.inventoryContainer.y -= deltaY * 0.5;
        
        const minY = this.y + this.height - 30 * this.cellHeight;
        this.inventoryContainer.y = Phaser.Math.Clamp(this.inventoryContainer.y, minY, this.y);
      }
    });
  }
}