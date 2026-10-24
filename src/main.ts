import Phaser from 'phaser';
import { gameConfig } from './game/config';
import { BootScene } from './game/scenes/BootScene.ts'; // Пример сцены

// Добавляем сцены в конфиг
gameConfig.scene = [BootScene];

// Создаем игру
new Phaser.Game(gameConfig);
