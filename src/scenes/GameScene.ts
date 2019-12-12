import { Phone } from './../models/Phone';
import { Game } from "../models/Game";

export class GameScene extends Phaser.Scene {

    private char: any; // & { body: Phaser.Physics.Arcade.Body }
    private phone: Phone;
    private cursorKeys: any;
    private spaceBar: any;
    private map: any;
    private mother: any;

    /**
     * Boolean to check MOTHER
     */
    private hasPassedMother: boolean = false;
    private hasReceivedNotificationMother: boolean = false;


    constructor() {
        super({ key: 'gamescene' });
        this.phone = new Phone();
    }

    preload() {
        //load in the map
        this.load.image('map', './assets/images/map.png');
        this.load.image('mother-textbubble', './assets/images/mother-textbubble.gif');
        this.load.image('notification-textbubble', './assets/images/notification-textbubble.gif');


        const info = (this.game as Game).characterInfo;


        //load character 
        if (info) {
            this.load.spritesheet(info.name, info.spreadsheetUri, { frameWidth: 64, frameHeight: 64 });
        }

        // load mother character
        this.load.spritesheet('mother', './assets/spritesheets/mother.png', { frameWidth: 64, frameHeight: 64 });

    }

    create() {
        //get game info
        const info = (this.game as Game).characterInfo;

        //get character name, by default boy if none is selected
        const characterName = info ? info.name : 'boy';

        // Add map to the scene
        this.map = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "map")
        this.map.displayWidth = 2500;
        this.map.displayHeight = this.game.canvas.height;

        // Set world bounds
        this.physics.world.setBounds(-770, 0, this.map.displayWidth, this.map.displayHeight, true, true, true, true);

        // Add character to the scene
        this.char = this.add.sprite(-600, 485, characterName, 0);
        this.char.flipX = true;
        this.physics.world.enableBody(this.char);

        // Makes the character collide with world bounds
        this.char.body.setCollideWorldBounds(true);
        this.char.body.onWorldBounds = true;

        this.physics.add.existing(this.char);

        // Animates the idle state of the character
        this.anims.create({
            key: 'idle',
            repeat: -1,
            frameRate: 1,  
            frames: this.anims.generateFrameNumbers(characterName, { start: 0, end: 0 })
        });

        // Animates the walking state of the character
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNumbers(characterName, { start: 0, end: 8 })
        });

        // Create the in-game phone
        const phoneSprite = this.add.sprite(0, this.map.displayHeight + 250, 'phone', 0);
        phoneSprite.setDepth(1);
        
        this.phone.addSprite(phoneSprite, .38, .38);
        this.loadMother();
    }

    update() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        if (this.cursorKeys.right.isDown) {
            this.char.body.setVelocityX(75); // move right with 50 speed
            this.char.anims.play('walk', true); // plays walking animation
            this.char.flipX = true; // flip the sprite to the left

        } else if (this.cursorKeys.left.isDown) {
            this.char.body.setVelocityX(-75) // move left with 50 speed
            this.char.anims.play('walk', true); // plays walking animation
            this.char.flipX = false; // use the original sprite looking to the right

        } else {
            this.char.body.setVelocityX(0);
            this.char.anims.play('idle', true); // plays the idle animtaion when no keys are pressed
        }

        // Using the JustDown function to prevent infinity repeat
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.hasReceivedNotificationMother)
            this.showPhone();

        this.cameras.main.setBounds(-770, 0, this.map.displayWidth, this.map.displayHeight);
        this.cameras.main.startFollow(this.char);

        this.onCollideMother();
        this.receiveNotificationMother();

        const phoneSprite = this.phone.getSprite();

        if (phoneSprite)
            phoneSprite.setX(this.char.body.x + 385); 
        

    }

    /**
     * Function which displays a notification by playing a sound and showing a message.
     */
    private notify() {

        // play sound
        const notificationSound = this.sound.add('NOTIFICATION');
        notificationSound.play();

        // display message
        const textBubble = this.add.image(this.char.body.x + 100, this.char.body.y - 50, "notification-textbubble")

        setTimeout(function () {
            textBubble.destroy();
        }, 10000);

    }

    /**
     * Let the phone appear on the screen
     */
    private showPhone() {
        if (this.phone)
            this.phone.togglePhone(this.map.displayHeight);
    }

    /**
     * Loads the mother 
     */
    private loadMother() {

        // Add mother character to the scene
        this.mother = this.add.sprite(-500, 485, 'mother', 9); // -500 X-position  485 Y-postion

        this.physics.world.enableBody(this.mother);
        this.physics.add.existing(this.mother);
    }

    private onCollideMother() {

        //get x from characters
        const playerX = this.char.body.x;
        const motherY = this.mother.body.y;
        const motherX = this.mother.body.x


        //is player in reach && scenario not played yet
        if (!this.hasPassedMother && playerX + 30 > motherX) {

            this.hasPassedMother = true;
            const textBubble = this.add.image(motherX + 100, motherY - 50, "mother-textbubble")

            setTimeout(function () {
                textBubble.destroy();
            }, 10000);
        }
    }

    private receiveNotificationMother() {

        const playerX = this.char.body.x;
        const motherX = this.mother.body.x
        const notificaitonX = motherX + 780;

        if (!this.hasReceivedNotificationMother && playerX > notificaitonX) {
            this.hasReceivedNotificationMother = true;
            this.notify();
        }
    }

}