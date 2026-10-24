import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(320, 180, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(320, 180, 276, 8).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(320-100, 180, 4, 8, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.font('"Press Start 2P"', )
        this.load.spritesheet('button', 'button.png', {frameWidth: 66, frameHeight: 16});
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        const fonts = [
            '8px "Press Start 2P"',
            '16px "Roboto"',
            '700 16px "Roboto"',   // bold is a separate load
            'italic 16px "Lora"'
        ];

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        Promise.all(fonts.map((font) => document.fonts.load(font)))
            .then(() => this.scene.start('Game'));
    }
}
