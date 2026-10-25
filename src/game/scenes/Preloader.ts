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
        const bg = this.add.image(320, 180, 'background');
        bg.enableFilters();
        bg.filters!.external.addBlur(1, 2, 2, 0.5);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(320, 180, 276, 8).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(320-136, 180, 4, 8, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 270px wide, so 100% = 274px)
            bar.width = 4 + (270 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.font('"Press Start 2P"')
        this.load.spritesheet('button', 'button.png', {frameWidth: 66, frameHeight: 16});
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
