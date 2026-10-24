import { Scene } from 'phaser';

class Menu
{
    menu_blur: Phaser.Filters.Blur;
    btns: Phaser.GameObjects.Container[];
};

function createButton(scene: Phaser.Scene, x: number, y: number, text: string, onClick: Function): Phaser.GameObjects.Container {
    const bg = scene.add.sprite(0, 0, 'button', 0)
        .setInteractive({ useHandCursor: true })
        .setScale(2);
    const label = scene.add.text(0, -5, text, {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2,
    }).setOrigin(0.5);

    bg.on('pointerover', () => { bg.setFrame(1); label.setY(0); })
        .on('pointerout', () => { bg.setFrame(0); label.setY(-4); })
        .on('pointerdown', () => { bg.setFrame(1); label.setY(0); })
        .on('pointerup', () => { onClick(); });

    return scene.add.container(x, y, [bg, label]);
}

function createButtons(scene: Phaser.Scene, data: {text: string, onClick: Function}[]): Phaser.GameObjects.Container[] {
    data.reverse();

    const result: Phaser.GameObjects.Container[] = [];

    const camera = scene.cameras.main;
    let y = camera.height - 24;
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        result.push(createButton(scene, 75, y, element.text, element.onClick));
        y -= 24;
    }

    return result;
}

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    menu: Menu
    msg_new_game : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.background = this.add.image(320, 180, 'background').enableFilters();
        const menu_blur = this.background.filters!.external.addBlur(1, 2, 2, 0.5);
        const btns = createButtons(this, [{text: 'Новая игра', onClick: () => {}}]);
        this.menu = {
            menu_blur: menu_blur,
            btns: btns,
        };

        // this.input.once('pointerdown', () => {
        //     this.scene.start('GameOver');
        // });
    }
}
