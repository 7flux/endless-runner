import Phaser from 'phaser';

type Point = { x: number; y: number };

export default class GameScene extends Phaser.Scene {
  private circle!: Phaser.GameObjects.Arc;
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private path: Point[] = [];
  private destination: Point | null = null;
  private speed = 100; // pixels per second
  private days = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Draw the circle at the center
    this.circle = this.add.circle(width / 2, height / 2, 24, 0x3498db);
    this.circle.setDepth(1);

    // For drawing the path
    this.pathGraphics = this.add.graphics();

    // Input to set destination
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.setDestination({ x: pointer.worldX, y: pointer.worldY });
    });
  }

  setDestination(dest: Point) {
    const start = { x: this.circle.x, y: this.circle.y };
    this.destination = dest;
    this.path = this.calculatePath(start, dest);
    this.days = this.calculateDays(this.path);
    this.drawPath();
  }

  calculatePath(start: Point, end: Point): Point[] {
    // Simple straight-line path for now (can be replaced with A* for grid maps)
    const points: Point[] = [];
    const steps = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y) / 32;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      points.push({
        x: Phaser.Math.Interpolation.Linear([start.x, end.x], t),
        y: Phaser.Math.Interpolation.Linear([start.y, end.y], t),
      });
    }
    points.push(end);
    return points;
  }

  calculateDays(path: Point[]): number {
    // Assume each day allows 128 pixels of movement (like HoMM5 movement points)
    const totalDistance = path.reduce((acc, point, i, arr) => {
      if (i === 0) return 0;
      return acc + Phaser.Math.Distance.Between(arr[i - 1].x, arr[i - 1].y, point.x, point.y);
    }, 0);
    const movementPerDay = 128;
    return Math.ceil(totalDistance / movementPerDay);
  }

  drawPath() {
    this.pathGraphics.clear();
    if (this.path.length < 2) {
      // Remove days text if path is not relevant
      const daysText = this.children.getByName('daysText');
      if (daysText) daysText.destroy();
      return;
    }
    this.pathGraphics.lineStyle(2, 0xffd700, 1);
    this.pathGraphics.beginPath();
    this.pathGraphics.moveTo(this.circle.x, this.circle.y);
    for (const point of this.path) {
      this.pathGraphics.lineTo(point.x, point.y);
    }
    this.pathGraphics.strokePath();

    // Draw or update days text at destination
    if (this.destination) {
      let daysText = this.children.getByName('daysText') as Phaser.GameObjects.Text | null;
      if (!daysText) {
        daysText = this.add.text(this.destination.x + 10, this.destination.y - 10, `${this.days} days`, {
          font: '16px Arial',
          color: '#fff',
          backgroundColor: '#222',
          padding: { x: 4, y: 2 },
        }).setDepth(2).setAlpha(0.8).setScrollFactor(0).setOrigin(0, 1).setName('daysText');
      } else {
        daysText.setText(`${this.days} days`);
        daysText.setPosition(this.destination.x + 10, this.destination.y - 10);
      }
    }
  }

  update(_: number, delta: number) {
    if (this.path.length > 0) {
      const next = this.path[0];
      const dist = Phaser.Math.Distance.Between(this.circle.x, this.circle.y, next.x, next.y);
      const move = (this.speed * delta) / 1000;
      if (dist <= move) {
        this.circle.setPosition(next.x, next.y);
        this.path.shift();
        if (this.path.length === 0) {
          this.destination = null;
        }
      } else {
        const angle = Phaser.Math.Angle.Between(this.circle.x, this.circle.y, next.x, next.y);
        this.circle.x += Math.cos(angle) * move;
        this.circle.y += Math.sin(angle) * move;
      }
      this.drawPath();
    }

    // Update days text position if it exists
    const daysText = this.children.getByName('daysText') as Phaser.GameObjects.Text | null;
    if (daysText && this.destination) {
      daysText.setPosition(this.destination.x + 10, this.destination.y - 10);
    }
  }
}