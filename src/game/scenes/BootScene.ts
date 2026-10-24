import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Просто выводим текст, чтобы убедиться, что все работает
    this.add.text(160, 90, 'Phaser Works!', { fontSize: '16px', color: '#fff' })
        .setOrigin(0.5);
  }
}