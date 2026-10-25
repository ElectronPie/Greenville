import * as Phaser from 'phaser';

import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 640,
    height: 360,
    parent: 'game-container',
    backgroundColor: '#464d34',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: true,
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    const fonts = [
        '8px "Press Start 2P"',
        '16px "Roboto"',
        '700 16px "Roboto"',   // bold is a separate load
        'italic 16px "Lora"'
    ];
    
    return Promise.all(fonts.map((font) => document.fonts.load(font)))
        .then(() => {
            document.fonts.ready.then(
                () => new Game({ ...config, parent })
            )
        });

}

export default StartGame;
