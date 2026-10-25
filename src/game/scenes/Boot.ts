import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/room.png');

        this.load.spritesheet('fire', 'assets/fire.png', { 
            frameWidth: 26, 
            frameHeight: 22 
        });

        this.load.spritesheet('hero', 'assets/kostya.png', { 
            frameWidth: 48, 
            frameHeight: 98
        });

        this.load.image('book_outline', 'assets/book-outline.png');
        this.load.image('k_outline', 'assets/kushetka-outline.png');
        this.load.image('bed_outline', 'assets/bed-outline.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
