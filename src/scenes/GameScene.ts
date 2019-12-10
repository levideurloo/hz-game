export class GameScene extends Phaser.Scene {

    private char: any & { body: Phaser.Physics.Arcade.Body };
    private cursorKeys: any;
    private map: any;


    constructor() {
        super('gamescene');
    }

    preload() {
        //load in the map
        this.load.image('map', './assets/images/map.png');

        //load spritesheet for male character
        this.load.spritesheet('boy', './assets/spritesheets/boy.png', { frameWidth: 64, frameHeight: 64 });

        //load spritesheet for female character
        //this.load.spritesheet('girl', './assets/spritesheets/girl.png', { frameWidth: 64, frameHeight: 64 });


    }

    create() {

        // Add map to the scene
        this.map = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "map")
        this.map.displayWidth = 2500;
        this.map.displayHeight = this.game.canvas.height;
        this.physics.add.existing(this.map);

        // Add character to the scene
        this.char = this.add.sprite(this.game.canvas.width / 2, 485, "boy", 0)
        this.physics.add.existing(this.char);
        this.anims.create({
            key: 'idle',
            repeat: -1,
            frameRate: 1,
            frames: this.anims.generateFrameNumbers('boy', { start: 0, end: 0 })
        });
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNumbers('boy', { start: 0, end: 8 })
        });

    }

    update() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        if (this.cursorKeys.right.isDown) {
            this.char.body.setVelocityX(50); // move left with 85 speed
            this.char.anims.play('walk', true); // plays walking animation
            this.char.flipX = true; // flip the sprite to the left

            this.map.body.setVelocityX(-100); // move the background to the right

        } else if (this.cursorKeys.left.isDown) {
            this.char.body.setVelocityX(-50) // move right with 85 speed
            this.char.anims.play('walk', true); // plays walking animation
            this.char.flipX = false; // use the original sprite looking to the right

            this.map.body.setVelocityX(117); // move left with 85 speed
        } else {
            this.char.body.setVelocityX(0);
            this.char.anims.play('idle', true); // plays the idle animtaion when no keys are pressed

            this.map.body.setVelocityX(0); // move the background to the left
        }
    }
}