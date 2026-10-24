import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    menuBlur: Phaser.Filters.Blur;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(320, 180, 'background');

        // Add blur in menu
        this.background.enableFilters();
        this.menuBlur = this.background.filters!.external.addBlur(1, 2, 2, 0.5);

        this.logo = this.add.image(320, 54, 'logo');

        this.title = this.add.text(320, 120, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
