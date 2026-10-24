import Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-root', // ID элемента в index.html
  width: 320,          // Внутреннее разрешение (как в прошлом обсуждении)
  height: 180,
  backgroundColor: '#101418',
  pixelArt: true,      // Отключает сглаживание
  scale: {
    mode: Phaser.Scale.FIT,             // Растягивает игру под экран
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,                   // Принудительное целочисленное масштабирование
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false, // Включите true, если нужно видеть хитбоксы
    },
  },
  scene: [], // Сюда мы добавим наши сцены
};