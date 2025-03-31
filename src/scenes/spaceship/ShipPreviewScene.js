import { Scene } from "phaser";

export class ShipPreviewScene extends Scene {
  remaining_time = 0;
  remaining_time_text;
  points_text;

  constructor() {
    super("ShipPreviewScene");
  }

  preload() {
    this.load.image('spaceship-equipment-background', 'assets/spaceship/spaceship-equipment.png');
  }

  init(data) {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.remaining_time = data.remaining_time;
  }

  create() {
    this.add.image(0, 0, "spaceship-equipment-background").setOrigin(0, 0).setSize(800, 400);
    // this.scene.add("SpaceshipEquipmentScene", SpaceshipEquipmentScene, true, {
    //   x: 0,
    //   y: 0,
    //   width: this.scale.width,
    //   height: this.scale.height,
    // });

    this.points_text = this.add.bitmapText(10, 10, "pixelfont", "Gold: should see an amount", 24);
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