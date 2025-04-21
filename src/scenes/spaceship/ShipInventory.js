const state = {
  idle: 'idle',
  dragging: 'dragging',
  dropping: 'dropping',
}

// TODO: figure out the interface ot force using same size on grid item (e.g. engine is 3x3, so no engine can be bigger, probably)
const shipEquipmentConfig = [
  {
    type: 'Weapon 1',
    location: [625, -325],
    size: [4, 1],
    current: {
      id: 'ion_cannon_000',
      type: 'Weapon',
      weight: 10,
      description: 'Ion Cannon. Most standard weapon',
      fireRate: 1,
      damage: 5,
      range: 100,
      speed: 5,
    }
  },
  {
    type: 'Weapon 2',
    location: [700, -125],
    size: [3, 1],
    current: null,
  },
  {
    type: 'Engine',
    location: [125, -225],
    size: [3, 3],
    current: {
      id: 'thruster_000',
      type: 'Engine',
      weight: 10,
      description: 'Thruster. Standard',
      speed: 5,
      fuelConsumption: 1,
      thrust: 10,
    }
  },
]

export class ShipInventory {
  width = 400;
  height = 400;
  cellWidth = 40;
  cellHeight = 40;
  cellsInRow = this.width / this.cellWidth;
  totalCellRows = 40;
  grid = Array(this.totalCellRows).fill(null).map(() => Array(this.cellsInRow).fill(null));
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
  }, {
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
  }, {
    name: 'Molecule Scanner',
    properties: {
      id: 'scanner_001',
      type: 'Scanner',
      weight: 2,
      size: [2, 1],
      description: 'Description of Molecule Scanner',
      power: 2,
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

    // Create equipment container
    this.createEquipmentContainer();

    // Create inventory container for items
    this.inventoryContainer = this.scene.add.container(0, 0);
    this.container.add(this.inventoryContainer);

    // Place items in the grid
    this.placeItemsInGrid();

    // Create preview panel
    this.createPreviewPanel();

    // // Set up scrolling
    // this.setupScrolling();
  }

  createEquipmentContainer() {
    this.equipmentContainer = this.scene.add.container(0, 0);

    for (let i = 0; i < shipEquipmentConfig.length; i++) {
      const itemGraphics = this.scene.add.graphics();

      const [x, y, width, height] = [...shipEquipmentConfig[i].location, shipEquipmentConfig[i].size[0] * this.cellWidth, shipEquipmentConfig[i].size[1] * this.cellHeight];

      itemGraphics.fillStyle(0x00aaaa, 0.3);
      itemGraphics.fillRect(x, y, width, height);

      const itemGroup = this.scene.add.container(0, 0);
      itemGroup.add([itemGraphics]);
      // Make item interactive
      itemGroup.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
      itemGroup.on('pointerover', (e) => {
        this.scene.input.setDefaultCursor('pointer');
        itemGraphics.clear();
        itemGraphics.fillStyle(0x3333ff, 0.7);
        itemGraphics.fillRect(x, y, width, height);
      });
      itemGroup.on('pointerout', () => {
        this.scene.input.setDefaultCursor('default');
        itemGraphics.clear();
        itemGraphics.fillStyle(0x00aaaa, 0.3);
        itemGraphics.fillRect(x, y, width, height);
      });

      this.equipmentContainer.add(itemGroup);
    }

    this.container.add(this.equipmentContainer);
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
      this.cellsInRow * this.cellWidth, this.totalCellRows * this.cellHeight,
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

        // TODO: make it a separate function
        // Hover effects
        itemGroup.on('pointerover', (e) => {
          this.scene.input.setDefaultCursor('pointer');
          itemGraphics.clear();
          itemGraphics.fillStyle(0x3333ff, 0.7);
          itemGraphics.fillRect(
            gridX * this.cellWidth,
            gridY * this.cellHeight,
            width * this.cellWidth,
            height * this.cellHeight
          );
          this.showItemPreview(item);
        });
        this.scene.input.setDraggable(itemGroup);

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
          this.cleanUpTooltip();
        });

        // Add to inventory container
        this.inventoryContainer.add(itemGroup);
        this.itemSprites.push({
          item,
          state: state.idle,
          graphics: itemGraphics,
          text,
          container: itemGroup,
          gridPosition: startingPosition,
          xyDeviations: { x: gridX*this.cellWidth, y: gridY*this.cellHeight },
        });
      }
    }

    this.setupDragAndDrop();
  }

  findFreeGridSpace(arrayWidth, arrayHeight) {
    for (let y = 0; y < this.totalCellRows; y++) {
      for (let x = 0; x < this.cellsInRow - arrayWidth + 1; x++) {
        let free = true;

        for (let dy = 0; dy < arrayHeight && free; dy++) {
          for (let dx = 0; dx < arrayWidth && free; dx++) {
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
    this.previewPanel = this.scene.add.container(this.cellsInRow * this.cellWidth + 2, 0);
    this.container.add(this.previewPanel);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x222222, 0.8);
    bg.fillRect(0, 0, 200, 400);
    this.previewPanel.add(bg);

    this.previewTitle = this.scene.add.text(10, 10, 'Item Preview', { fontSize: '18px', fill: '#fff' });
    this.previewDetails = this.scene.add.text(10, 40, '', { fontSize: '14px', fill: '#fff', wordWrap: { width: 180 } });

    this.previewPanel.add([this.previewTitle, this.previewDetails]);
  }

  // showSpaceshipPreview(item) {
  //   console.log('showItemPreview')
  //   this.previewTitle.setText(item.name);

  //   let details = `Type: ${item.properties.type}\n`;
  //   details += `Size: ${item.properties.size[0]}x${item.properties.size[1]}\n`;
  //   details += `Weight: ${item.properties.weight}\n\n`;
  //   details += item.properties.description + '\n\n';

  //   // Type-specific properties
  //   if (item.properties.type === 'Weapon') {
  //     details += `Damage: ${item.properties.damage}\n`;
  //     details += `Fire Rate: ${item.properties.fireRate}\n`;
  //     details += `Range: ${item.properties.range}\n`;
  //   } else if (item.properties.type === 'Engine') {
  //     details += `Thrust: ${item.properties.thrust}\n`;
  //     details += `Speed: ${item.properties.speed}\n`;
  //     details += `Fuel Consumption: ${item.properties.fuelConsumption}\n`;
  //   }

  //   this.previewDetails.setText(details);
  // }

  cleanUpTooltip() {
    if (this.tooltipScrollHandler) {
      this.scene.input.off('wheel', this.tooltipScrollHandler);
      this.tooltipScrollHandler = null;
    }
    this.tooltip.destroy();
  }

  showItemPreview(item) {
    // Clean up existing tooltip if present
    if (this.tooltip) {
      this.cleanUpTooltip();
    }

    // Create tooltip container
    this.tooltip = this.scene.add.container();
    this.tooltip.setDepth(1000); // Ensure it's on top

    // Create background
    const tooltipBg = this.scene.add.graphics();
    tooltipBg.fillStyle(0x222222, 0.9);
    tooltipBg.lineStyle(1, 0x44ff88);

    // Create title text
    const titleText = this.scene.add.text(10, 10, item.name, {
      fontSize: '16px',
      fontWeight: 'bold',
      fill: '#ffffff'
    });

    // Build details text
    let details = `Type: ${item.properties.type}\n`;
    details += `Size: ${item.properties.size[0]}x${item.properties.size[1]}\n`;
    details += `Weight: ${item.properties.weight}\n\n`;
    details += item.properties.description + '\n\n';

    // Add type-specific properties
    if (item.properties.type === 'Weapon') {
      details += `Damage: ${item.properties.damage}\n`;
      details += `Fire Rate: ${item.properties.fireRate}\n`;
      details += `Range: ${item.properties.range}\n`;
      details += `Speed: ${item.properties.speed}\n`;
    } else if (item.properties.type === 'Engine') {
      details += `Thrust: ${item.properties.thrust}\n`;
      details += `Speed: ${item.properties.speed}\n`;
      details += `Fuel Consumption: ${item.properties.fuelConsumption}\n`;
    }

    // Create details text
    const detailsText = this.scene.add.text(10, titleText.height + 20, details, {
      fontSize: '14px',
      fill: '#ffffff',
      wordWrap: { width: 240 }
    });

    // Create content container
    const contentContainer = this.scene.add.container(0, 0);
    contentContainer.add([titleText, detailsText]);

    // Calculate dimensions
    const padding = 20;
    const tooltipWidth = Math.max(titleText.width, detailsText.width) + padding * 2;
    const contentHeight = titleText.height + detailsText.height + 30;
    const tooltipHeight = Math.min(400, contentHeight);

    // Draw background
    tooltipBg.fillRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);
    tooltipBg.strokeRoundedRect(0, 0, tooltipWidth, tooltipHeight, 8);

    // Add elements to tooltip
    this.tooltip.add(tooltipBg);
    this.tooltip.add(contentContainer);

    // Position tooltip
    const pointer = this.scene.input.activePointer;
    let tooltipX = pointer.x + 15;
    let tooltipY = pointer.y + 15;

    // Adjust position if would be off-screen
    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;

    if (tooltipX + tooltipWidth > gameWidth) {
      tooltipX = pointer.x - tooltipWidth - 15;
    }

    if (tooltipY + tooltipHeight > gameHeight) {
      tooltipY = pointer.y - tooltipHeight - 15;
    }

    this.tooltip.setPosition(tooltipX, tooltipY);

    // Set up scrolling if content is too large
    if (contentHeight > tooltipHeight) {
      // Create mask shape
      const maskShape = this.scene.make.graphics();
      maskShape.fillStyle(0xffffff);
      maskShape.fillRect(0, 0, tooltipWidth, tooltipHeight);

      // Create mask and apply to content
      const mask = new Phaser.Display.Masks.GeometryMask(this.scene, maskShape);
      contentContainer.setMask(mask);

      // Position mask with the tooltip
      maskShape.x = tooltipX;
      maskShape.y = tooltipY;

      // Add scroll indicator
      const scrollIndicator = this.scene.add.graphics();
      scrollIndicator.fillStyle(0x44ff88, 0.7);
      scrollIndicator.fillRoundedRect(tooltipWidth - 15, 10, 5, 50, 2);
      this.tooltip.add(scrollIndicator);

      // Set up scroll handling
      let scrollY = 0;
      const maxScroll = contentHeight - tooltipHeight + padding;

      this.tooltipScrollHandler = (pointer, gameObjects, deltaX, deltaY) => {
        if (
          pointer.x >= tooltipX &&
          pointer.x <= tooltipX + tooltipWidth &&
          pointer.y >= tooltipY &&
          pointer.y <= tooltipY + tooltipHeight
        ) {
          scrollY = Phaser.Math.Clamp(
            scrollY + deltaY * 0.5,
            0,
            maxScroll
          );

          contentContainer.y = -scrollY;

          // Update scroll indicator position
          const scrollRatio = scrollY / maxScroll;
          const indicatorTravel = tooltipHeight - 70;
          scrollIndicator.y = 10 + (scrollRatio * indicatorTravel);
        }
      };

      this.scene.input.on('wheel', this.tooltipScrollHandler);
    }

    return this.tooltip;
  }

  setupDragAndDrop() {
    // TODO: game object will have it's own coordinates deviation based on initial location (if real x = 60px, it will think during any events, that x is actully 0px, since it's it's starting position)
    this.scene.input.on('drag', (_, gameObject, dragX, dragY) => {
      this.cleanUpTooltip();
      gameObject.x = dragX;
      gameObject.y = dragY;

      // means it's in the Equipment screen
      // TODO: fixme
      if (dragY < 0) {
        const itemType = gameObject.type;
        const sameEquipment = shipEquipmentConfig.find(e => e.type === itemType);
        // y = -200, x = 100, size 3x3
        if (dragY > sameEquipment.location[1] && dragY < sameEquipment.location[1] + sameEquipment.size[1]*this.cellHeight && 
          dragX > sameEquipment.location[0] && dragX < sameEquipment.location[0] + sameEquipment.size[0]*this.cellWidth 
        ) {
          console.log('hovered equipmnet (engine)')
        }
      }
    });

    this.scene.input.on('dragend', (_, gameObject) => {
      const item = this.itemSprites.find(sprite => sprite.container === gameObject);

      if (item) {
        const gridX = Math.floor((gameObject.x + item.xyDeviations.x) / this.cellWidth);
        const gridY = Math.floor((gameObject.y + item.xyDeviations.y) / this.cellHeight);

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
          gameObject.x = gridX * this.cellWidth - item.xyDeviations.x;
          gameObject.y = gridY * this.cellHeight - item.xyDeviations.y;
        } else {
          // Return to original position
          gameObject.x = item.gridPosition[0] * this.cellWidth - item.xyDeviations.x;
          gameObject.y = item.gridPosition[1] * this.cellHeight - item.xyDeviations.y;
        }
      }
    });
  }

  /* rules 
    1. moving out of inventory container:
      1.1. check if it's in the equipment area
      1.2. if it's not, and drag&drop ends - return to original position
      1.3. if it is:
        1.3.1 - check if it can placed to equipments area: requirenments met, like skills or item is suited there. 
        1.3.2 - otherwise return to original position
    2. within inventory container:
      2.1. check if it's in the grid area
      2.2. check if it doesn't overlap other items
  */

  isValidPlacement(item, gridX, gridY, currentPos) {
    const [width, height] = item.properties.size;
    const [currentX, currentY] = currentPos;

    // Check bounds
    if (gridX < 0 || gridY < 0 || gridX + width > this.cellsInRow || gridY + height > this.totalCellRows) {
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
    const { x, y } = this.containerOrigin;
    const mask = this.scene.add.graphics();
    mask.fillStyle(0xffffff);
    mask.fillRect(x, y, 7 * this.cellWidth, this.height);

    this.inventoryContainer.mask = new Phaser.Display.Masks.GeometryMask(this.scene, mask);

    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.x && pointer.x <= x + 7 * this.cellWidth &&
        pointer.y >= this.y && pointer.y <= y + this.height) {
        this.inventoryContainer.y -= deltaY * 0.5;

        const minY = this.y + this.height - 30 * this.cellHeight;
        this.inventoryContainer.y = Phaser.Math.Clamp(this.inventoryContainer.y, minY, y);
      }
    });
  }
}