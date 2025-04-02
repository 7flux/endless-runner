import { Scene } from "phaser";

export class MainScene extends Scene {
    player = null;
    enemy_blue = null;
    cursors = null;

    points = 0;
    game_over_timeout = 20;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points
        this.points = 0;
        this.game_over_timeout = 20;
    }

    create() {
        // this.add.image(0, 0, "background")
        //     .setOrigin(0, 0);
        // this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);
        // // Player
        // this.player = new Player({ scene: this });
        // // Enemy
        // this.enemy_blue = new BlueEnemy(this);
        // // Cursor keys 
        // this.cursors = this.input.keyboard.createCursorKeys();
        // this.cursors.space.on("down", () => {
        //     this.player.fire();
        // });
        // this.input.on("pointerdown", (pointer) => {
        //     this.player.fire(pointer.x, pointer.y);
        // });
        // // Overlap enemy with bullets
        // this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
        //     bullet.destroyBullet();
        //     this.enemy_blue.damage(this.player.x, this.player.y);
        //     this.points += 10;
        //     this.scene.get("HudScene")
        //       .update_points(this.points);
        // });
        // Overlap player with enemy bullets
        // this.physics.add.overlap(this.enemy_blue.bullets, this.player, (player, bullet) => {
        //     bullet.destroyBullet();
        //     this.cameras.main.shake(100, 0.01);
        //     // Flash the color white for 300ms
        //     this.cameras.main.flash(300, 255, 10, 10, false,);
        //     this.points -= 10;
        //     this.scene.get("HudScene")
        //       .update_points(this.points);
        // });

        this.scene.launch("SpaceshipEquipmentScene", { remaining_time: this.game_over_timeout });
    }

    update() {
    }
}