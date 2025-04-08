export class ShipInventory {
  width=400;
  height=400;
  cellWidth=30;
  cellHeight=30;
  grid = Array(30).fill(null).map(() => Array(7).fill(null));
  scene;
  containerOrigin = {
    x: 0,
    y: 0
  };
  itemSprites = [];
  container;

  items = [{
    name: 'Ion Cannon',
    properties: {
      id: 'ion_cannon_001',
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
      id: 'thruster_001',
      type: 'Engine',
      weight: 10,
      size: [3, 3],
      description: 'Description of Item 2',
      speed: 5,
      fuelConsumption: 1,
      thrust: 10,
    }
  }];

  /** @param {Phaser.Scene} scene - parent scene */
  constructor(scene, x, y) {
    this.scene = scene;
    this.container = this.scene.add.container(x, y);
    this.containerOrigin.x = x;
    this.containerOrigin.y = y;

    // Create grid background
    this.createGrid();

    // Create inventory container for items
    this.inventoryContainer = this.scene.add.container(0, 0);
    this.container.add(this.inventoryContainer);
    
    // Place items in the grid
    this.placeItemsInGrid();

    // Create preview panel
    this.createPreviewPanel();
    
    // // Set up scrolling
    // this.setupScrolling();

    console.log(this)
  }
  
  preload() {
    // No assets to preload for now
  }

  createGrid() {
    // Generate a texture from a single cell for better performance (directly)
    const cellTexture = this.scene.textures.createCanvas('gridCellTexture', this.cellWidth, this.cellHeight);
    const context = cellTexture.getContext();
    context.strokeStyle = '#44ff88';
    context.lineWidth = 1;
    context.strokeRect(0, 0, this.cellWidth, this.cellHeight);
    cellTexture.refresh();

    // Create a tiled sprite using the cell texture
    this.gridSprite = this.scene.add.tileSprite(
      0, 0, // Position relative to container
      7 * this.cellWidth, 30 * this.cellHeight,
      'gridCellTexture'
    );
    this.gridSprite.setOrigin(0, 0);

    // Add the sprite to the container
    this.container.add(this.gridSprite);
  }

  placeItemsInGrid() {
    this.itemSprites = [];

    // Place items in the grid
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const [width, height] = item.properties.size;

      // Find a free space in the grid
      const startingPosition = this.findFreeGridSpace(width, height);

      if (startingPosition) {
        const [gridX, gridY] = startingPosition;

        // Create item visual
        const itemGraphics = this.scene.add.graphics();
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
            this.grid[y][x] = { item, gridX, gridY, width, height };
          }
        }
        
        // Add text label - correct creation through scene
        const text = this.scene.add.text(
          gridX * this.cellWidth + 5, 
          gridY * this.cellHeight + 5, 
          item.name, 
          { fontSize: '12px', fill: '#fff', wordWrap: { width: width * this.cellWidth - 10 } }
        );
        
        // Group item graphics and text
        const itemGroup = this.scene.add.container(0, 0);
        itemGroup.add([itemGraphics, text]);
        
        // Make item interactive
        itemGroup.setInteractive(new Phaser.Geom.Rectangle(
          gridX * this.cellWidth, 
          gridY * this.cellHeight, 
          width * this.cellWidth, 
          height * this.cellHeight
        ), Phaser.Geom.Rectangle.Contains);
        
        // Hover effects
        itemGroup.on('pointerover', () => {
          this.scene.input.setDefaultCursor('pointer');
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
          this.scene.input.setDefaultCursor('default');
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
          this.scene.input.setDraggable(itemGroup);
        });

        // Add to inventory container
        this.inventoryContainer.add(itemGroup);
        this.itemSprites.push({ 
          item, 
          graphics: itemGraphics, 
          text, 
          container: itemGroup, 
          gridPosition: startingPosition 
        });
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

  // last prompt
  // setupBottomHalfLayout(gameHeight) {
  //   // Position at bottom half of screen
  //   this.container.setPosition(this.container.x, gameHeight / 2);

  //   // Create background for bottom section
  //   const bg = this.scene.add.graphics();
  //   bg.fillStyle(0x333344, 0.8);
  //   bg.fillRect(0, 0, this.width + 250, gameHeight / 2);
  //   this.container.add(bg);
  //   bg.setPosition(0, 0);
    
  //   // Left side: inventory (already being created)
  //   // Make sure the grid and inventory are properly positioned
  //   this.gridSprite.setPosition(10, 10);
  //   this.inventoryContainer.setPosition(10, 10);
    
  //   // Right side: preview panel
  //   this.createPreviewPanel();
  //   this.previewPanel.setPosition(7 * this.cellWidth + 20, 10);
    
  //   // Add separator between inventory and preview
  //   const separator = this.scene.add.graphics();
  //   separator.lineStyle(2, 0x44ff88, 1);
  //   separator.lineBetween(
  //     7 * this.cellWidth + 10, 5,
  //     7 * this.cellWidth + 10, gameHeight / 2 - 5
  //   );
  //   this.container.add(separator);
    
  //   // Setup scrolling for inventory
  //   this.setupScrolling();
    
  //   return this.container;
  // }

  createPreviewPanel() {
    console.log('createPreviewPanel')
    this.previewPanel = this.scene.add.container(7 * this.cellWidth + 2, 0);
    this.container.add(this.previewPanel);
    
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x222222, 0.8);
    bg.fillRect(0, 0, 200, 400);
    this.previewPanel.add(bg);
    
    this.previewTitle = this.scene.add.text(10, 10, 'Item Preview', { fontSize: '18px', fill: '#fff' });
    this.previewDetails = this.scene.add.text(10, 40, '', { fontSize: '14px', fill: '#fff', wordWrap: { width: 180 } });
    
    this.previewPanel.add([this.previewTitle, this.previewDetails]);
  }

  showItemPreview(item) {
    console.log('showItemPreview')
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
    this.scene.input.on('drag', (_, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.scene.input.on('dragend', (_, gameObject) => {
      const item = this.itemSprites.find(sprite => sprite.container === gameObject);

      if (item) {
        const gridX = Math.floor((gameObject.x) / this.cellWidth);
        const gridY = Math.floor((gameObject.y) / this.cellHeight);

        if (this.isValidPlacement(item.item, gridX, gridY, item.gridPosition)) {
          const [oldX, oldY] = item.gridPosition;
          const [width, height] = item.item.properties.size;
          
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              // remove from grid
              this.grid[oldY + y][oldX + x] = null; 
              // add
              this.grid[gridY + y][gridX + x] = { item: item.item, gridX, gridY, width, height };
            } 
          }
          
          item.gridPosition = [gridX, gridY];
          gameObject.x = /* this.containerOrigin.x +  */gridX * this.cellWidth;
          gameObject.y = /* this.containerOrigin.y +  */gridY * this.cellHeight;
        } else {
          // Return to original position
          gameObject.x = /* this.containerOrigin.x +  */item.gridPosition[0] * this.cellWidth;
          gameObject.y = /* this.containerOrigin.y +  */item.gridPosition[1] * this.cellHeight;
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
    const mask = this.scene.add.graphics();
    mask.fillStyle(0xffffff);
    mask.fillRect(this.x, this.y, 7 * this.cellWidth, this.height);
    
    this.container.inventoryContainer.mask = new Phaser.Display.Masks.GeometryMask(this, mask);
    
    this.container.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.x && pointer.x <= this.x + 7 * this.cellWidth &&
          pointer.y >= this.y && pointer.y <= this.y + this.height) {
        this.container.inventoryContainer.y -= deltaY * 0.5;
        
        const minY = this.y + this.height - 30 * this.cellHeight;
        this.container.inventoryContainer.y = Phaser.Math.Clamp(this.container.inventoryContainer.y, minY, this.y);
      }
    });
  }
}