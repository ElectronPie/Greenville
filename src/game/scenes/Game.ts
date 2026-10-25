import * as Phaser from 'phaser';

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

function exitMenu(scene: Game) {
    // if (menu.btns.length === 0 || menu.btns[0].alpha === 0) return;

    //menu.btns[0].setInteractive(false);

    // Анимация блюра
    scene.tweens.add({
        targets: scene.menuBlur,
        strength: 0, 
        duration: 2000,
        ease: 'Linear'
    });

    // Анимация кнопок
    scene.tweens.add({
        targets: scene.uiLayer.list,
        alpha: 0,
        duration: 1000,
        ease: 'Linear',
        onComplete: () => {
            // Уничтожаем кнопки и очищаем UI-слой
            scene.uiLayer.list.forEach((child: any) => child.destroy());
            //scene.uiLayer.clear(true, true); // true, true = удалить всех детей и очистить массив
            
            // На всякий случай отключаем вторую камеру, она больше не нужна
            // scene.uiCamera.setVisible(false);
        }
    });
}

function createAnimatedObject(scene: Phaser.Scene, x: number, y: number, animKey: string): Phaser.GameObjects.Sprite {
    const sprite = scene.add.sprite(x, y, 'fire');
    sprite.play(animKey); // Запускаем анимацию
    return sprite;
}

export class Game extends Phaser.Scene
{
    gameLayer!: Phaser.GameObjects.Layer;
    uiLayer!: Phaser.GameObjects.Layer;
    gameCamera!: Phaser.Cameras.Scene2D.Camera;
    uiCamera!: Phaser.Cameras.Scene2D.Camera;
    menuBlur: Phaser.Filters.Blur;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    menu: Menu;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Огонь
        if (!this.anims.exists('fire_anim')) {
            this.anims.create({
                key: 'fire_anim',
                frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 3 }), // 4 кадра
                frameRate: 4, // Скорость (4щщ кадров в секунду)
                repeat: -1    // Зациклить навсегда
            });
        }



        // 1. Создаем камеры
        this.gameCamera = this.cameras.main;
        this.uiCamera = this.cameras.add(0, 0, 640, 360); // Размеры вашей игры
        
        // 2. Создаем два слоя для порядка: мир и UI
        this.gameLayer = this.add.layer();
        this.uiLayer = this.add.layer();

        // 3. Настраиваем главную камеру (она станет нашей gameCamera)
        this.background = this.add.image(320, 180, 'background');
        this.gameLayer.add(this.background);
        const fire = createAnimatedObject(this, 462, 285, 'fire_anim');
        this.gameLayer.add(fire);

        // 4. Распределяем, что какая камера должна игнорировать
        // gameCamera не должна видеть элементы UI
        this.gameCamera.ignore(this.uiLayer);
        // uiCamera не должна видеть игровой мир
        this.uiCamera.ignore(this.gameLayer);

        // 5. Добавляем кнопки в uiLayer
        const btns = createButtons(this, [{text: 'Новая игра', onClick: () => exitMenu(this)}]);
        btns.forEach(btn => this.uiLayer.add(btn));

        // 6. Применяем фильтр размытия ТОЛЬКО к gameCamera
        // Фильтры на камерах в Phaser 4 включены по умолчанию[reference:2]
        const blur = this.gameCamera.filters.external.addBlur(1, 2, 2, 0.5);
        this.menuBlur = blur;

        this.menu = {
            menu_blur: this.menuBlur,
            btns: btns,
        };

        this.time.delayedCall(100, () => {
            this.menu.btns.forEach((btnContainer) => {
                // Ищем внутри контейнера объект типа Text
                const label = btnContainer.list.find(
                    (child) => child instanceof Phaser.GameObjects.Text
                ) as Phaser.GameObjects.Text;

                // Если нашли — обновляем текстуру
                if (label) {
                    label.updateText();
                }
            });
        });



        // this.input.once('pointerdown', () => {
        //     this.scene.start('GameOver');
        // });
    }
}
