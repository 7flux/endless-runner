export class ShipPreview {
  remaining_time = 0;
  remaining_time_text;
  points_text;
  containerOrigin = {
    x: 0,
    y: 0
  };

  /** @param {Phaser.Scene} scene - parent scene */
  constructor(scene, x, y) {
    this.scene = scene;
    this.container = this.scene.add.container(x, y);
    this.containerOrigin.x = x;
    this.containerOrigin.y = y;

    this.create();
  }

  create() {
    this.scene.add.image(0, 0, "spaceship-equipment-background").setOrigin(0, 0).setDisplaySize(this.scene.scale.width, this.scene.scale.height / 2);
 
    // make that image interactive. I need it to have drag & drop support, so that I can drag and drop the spaceship equipment, e.g. by placing or removing an equipment from it's slot. slot gonna be a rectangle 40x30 pixels. Create a container (mask) for it, not the image itself. The container should be the same size as the image, and the image should be a child of the container. The container should be draggable, and the background image should not be draggable, only the equipments (also will have their image + mask).

    // this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    //     gameObject.x = dragX;
    //     gameObject.y = dragY;
    // });
    // this.input.on('dragend', (pointer, gameObject) => {
    //     gameObject.setAlpha(1);
    // });
    // this.input.on('dragstart', (pointer, gameObject) => {
    //     gameObject.setAlpha(0.5);
    // });
    // this.input.on('dragenter', (pointer, gameObject) => {
    //     gameObject.setAlpha(0.5);
    // });
    // this.input.on('dragleave', (pointer, gameObject) => {
    //     gameObject.setAlpha(1);
    // });
    // this.input.on('dragover', (pointer, gameObject) => {
    //     gameObject.setAlpha(0.5);
    // });
    // this.input.on('dragout', (pointer, gameObject) => {
    //     gameObject.setAlpha(1);
    // });
    // this.input.on('drop', (pointer, gameObject) => {
    //     gameObject.setAlpha(1);
    // });

    
 
    this.points_text = this.scene.add.bitmapText(10, 10, "pixelfont", "Gold: should see an amount", 24);
    // this.remaining_time_text = this.add.bitmapText(this.scale.width - 10, 10, "pixelfont", `REMAINING:${this.remaining_time}s`, 24)
    // .setOrigin(1, 0);
  }

  update_points(points) {
    // this.points_text.setText(`POINTS:${points.toString().padStart(4, "0")}`);
  }

  update_timeout(timeout) {
    // this.remaining_time_text.setText(`REMAINING:${timeout.toString().padStart(2, "0")}s`);
  }
}