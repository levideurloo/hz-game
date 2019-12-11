import { Game } from "../models/Game";

export class TitleScene extends Phaser.Scene {

    private selectedCharacterText: Phaser.GameObjects.Text | undefined;
    private music: Phaser.Sound.BaseSound | undefined;

    constructor() {
        super({
            key: 'main',
            pack: {
                files: [
                    { type: 'image', key: 'title-button', url: './assets/images/game-title.png' },
                    { type: 'image', key: 'next-button', url: './assets/images/next-button.jpg' },
                    { type: 'image', key: 'boy-image', url: './assets/images/boy-img.jpg' },
                    { type: 'image', key: 'girl-image', url: './assets/images/girl-img.jpg' },
                ]
            }
        });
    }

    preload() {
        this.loadMusic();
    }

    create() {
        this.loadTitle();
        this.loadCharacters();
        this.loadNextBtn();
    }

    private loadTitle() {
        const title = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 5, 'title-button');
    }

    /**
     * Load music function
     */
    private loadMusic() {
        this.music = this.sound.add('DOG');
        // this.music.play();
    }

    /**
    * Stop music
    */
    private stopMusic() {
        if (this.music) {
            this.music.stop();
        }
    }

    /**
     * Add next button to screen
     */
    private loadNextBtn() {

        // Add next button image
        const nextBtn = this.add.image(this.game.canvas.width / 2, this.game.canvas.height * 0.9, 'next-button').setScale(0.2);

        //Add pointer down listener
        nextBtn.setInteractive().on('pointerdown', () => {

            //check if a character is selected
            if (!(this.game as Game).characterInfo) {
                alert("Selecteer eerst een speler!");
                return false;
            }

            this.stopMusic();
            this.scene.start("gamescene");
        });
    }

    /**
     * Add characters to screen
     */
    private loadCharacters() {

        //Add characters
        const boyCharacter = this.add.image(this.game.canvas.width * 0.25, this.game.canvas.height * 0.5, 'boy-image').setScale(0.2).setName("boy");
        const girlCharacter = this.add.image(this.game.canvas.width * 0.75, this.game.canvas.height * 0.5, 'girl-image').setScale(0.2).setName("girl");

        //Add pointer down listener
        [boyCharacter, girlCharacter].forEach(function (element) {
            element.setInteractive().on('pointerdown', function (this: Phaser.GameObjects.Image) {

                //destroy text
                const selectedCharacterText = (this.scene as TitleScene).selectedCharacterText;

                if (selectedCharacterText) {
                    selectedCharacterText.destroy();
                }

                //set game property
                (this.scene.game as Game).characterInfo = { name: element.name, spreadsheetUri: `./assets/spritesheets/${element.name}.png` };

                //set selected text
                (this.scene as TitleScene).selectedCharacterText = this.scene.add.text(this.x - this.displayWidth / 2, (this.y + this.displayHeight) + 20, "Geselecteerd").setColor("white");

            });
        }, this);

    }
}