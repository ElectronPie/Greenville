# Greenville

Игра на [Phaser 4](https://github.com/phaserjs/phaser) с использованием [Vite](https://github.com/vitejs/vite) и TypeScript. Проект основан на шаблоне [Phaser Vite TypeScript Template](https://github.com/phaserjs/template-vite-ts). Деплой выполняется через Docker, команды обёрнуты в `Makefile`.

## Технологии

- [Phaser 4](https://github.com/phaserjs/phaser)
- [Vite 6.3.1](https://github.com/vitejs/vite)
- [TypeScript 5.7.2](https://github.com/microsoft/TypeScript)
- Docker + Make (деплой)

## Требования

Для локальной разработки:

- [Node.js](https://nodejs.org) и `npm`

Для деплоя:

- [Docker](https://docs.docker.com/get-docker/)
- GNU Make

## Локальная разработка

| Команда | Описание |
|---------|----------|
| `npm install` | Установить зависимости |
| `npm run dev` | Запустить сервер разработки |
| `npm run build` | Собрать production-сборку в папку `dist` |
| `npm run dev-nolog` | Запустить сервер разработки без отправки анонимных данных (см. «О log.js») |
| `npm run build-nolog` | Собрать production-сборку без отправки анонимных данных (см. «О log.js») |

После клонирования репозитория выполните `npm install`, затем `npm run dev`. Сервер разработки по умолчанию доступен на `http://localhost:8080`. Изменения в папке `src` автоматически пересобираются, страница в браузере перезагружается сама.

## Деплой

Приложение собирается и запускается в Docker-контейнере. Параметры по умолчанию заданы в начале `Makefile`:

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `IMAGE_NAME` | `greenville` | Имя Docker-образа |
| `CONTAINER_NAME` | `greenville` | Имя контейнера |
| `PORT` | `3000` | Порт, который пробрасывается с хоста в контейнер |

### Первый запуск

```bash
git clone <repo-url>
cd greenville

make build   # собрать образ
make up      # запустить контейнер в фоне
```

После запуска игра доступна по адресу `http://<адрес-сервера>:3000`.

Контейнер запускается с политикой `--restart unless-stopped`, поэтому он автоматически поднимется после перезагрузки сервера или падения Docker, если его не останавливали вручную.

### Обновление версии

```bash
git pull
make build
make restart
```

`make restart` останавливает и удаляет старый контейнер, затем запускает новый. Он **не пересобирает** образ, поэтому сначала всегда выполняйте `make build`.

### Команды Makefile

| Команда | Описание |
|---------|----------|
| `make build` | Собрать Docker-образ `greenville` |
| `make up` | Запустить контейнер в фоновом режиме с пробросом порта `PORT` |
| `make down` | Остановить и удалить контейнер (если его нет, ошибки не будет) |
| `make restart` | Выполнить `down`, затем `up` |
| `make logs` | Показывать логи контейнера в реальном времени (выход: `Ctrl+C`) |
| `make shell` | Открыть командную оболочку (`sh`) внутри работающего контейнера |
| `make clean` | Остановить контейнер и удалить Docker-образ |

### Смена порта

Порт можно переопределить при запуске:

```bash
make up PORT=8081
```

Обратите внимание: в `Makefile` порт хоста и порт контейнера задаются одной переменной (`-p $(PORT):$(PORT)`). Если приложение внутри контейнера слушает фиксированный порт `3000`, то менять `PORT` нужно вместе с настройкой в `Dockerfile`, либо изменить маппинг на `-p $(PORT):3000`.

### Проверка и диагностика

```bash
docker ps                # контейнер должен быть в статусе Up
make logs                # логи приложения
make shell               # зайти внутрь контейнера
curl -I http://localhost:3000   # проверить, что сервер отвечает
```

Если `make up` падает с ошибкой, что имя контейнера уже занято, выполните `make down` или используйте `make restart`.

### Полная очистка

```bash
make clean
```

Команда остановит контейнер и удалит образ. Файлы проекта не затрагиваются.

### Деплой без Docker

Если нужно обойтись без контейнера, соберите проект и выложите содержимое папки `dist` на любой статический веб-сервер:

```bash
npm install
npm run build
```

Загружайте на сервер **всё** содержимое `dist`.

## Структура проекта

| Путь | Описание |
|------|----------|
| `index.html` | Базовая HTML-страница, в которой запускается игра |
| `public/assets` | Спрайты, звук и т. д. Отдаются как статика |
| `public/style.css` | Глобальные стили |
| `src/main.ts` | Точка входа приложения |
| `src/game` | Код игры |
| `src/game/main.ts` | Конфигурация и запуск игры |
| `src/game/scenes` | Сцены Phaser |
| `Dockerfile` | Описание образа для деплоя |
| `Makefile` | Команды сборки и деплоя |

## Работа с ресурсами

Vite поддерживает загрузку ресурсов через `import`:

```js
import logoImg from './assets/logo.png'
```

Статические файлы (аудио, видео и т. п.) кладите в `public/assets` и подключайте по пути в загрузчике Phaser:

```js
preload ()
{
    //  Пример импортированного (встроенного в бандл) изображения.
    //  Не забудьте импортировать его в начале файла
    this.load.image('logo', logoImg);

    //  Пример загрузки статического изображения
    //  из папки public/assets:
    this.load.image('background', 'assets/bg.png');
}
```

При `npm run build` все статические ресурсы автоматически копируются в `dist/assets`, а затем попадают в Docker-образ при `make build`.

## Настройка сборки

Для кастомизации Vite (плагины для CSS, шрифтов и т. д.) измените файл `vite/config.*.mjs` или создайте новые конфигурации и укажите их в нужных скриптах `package.json`. Подробности в [документации Vite](https://vitejs.dev/).

## О log.js

В скриптах шаблона есть файл `log.js`. Он делает один тихий API-вызов на домен `gryzor.co`, принадлежащий Phaser Studio Inc.

Отправляются всего три значения: название шаблона, тип сборки (`dev` или `prod`) и версия Phaser. Персональные данные, информация о ваших файлах, устройстве или браузере не собираются. Вы можете убедиться в этом, прочитав `log.js`.

Если не хотите ничего отправлять, используйте:

```bash
npm run dev-nolog
npm run build-nolog
```

Чтобы отключить вызов полностью, удалите файл `log.js` и уберите его вызов из раздела `scripts` в `package.json`:

До:

```json
"scripts": {
    "dev": "node log.js dev & dev-template-script",
    "build": "node log.js build & build-template-script"
},
```

После:

```json
"scripts": {
    "dev": "dev-template-script",
    "build": "build-template-script"
},
```

> Если сборка выполняется в Docker, проверьте, что `Dockerfile` вызывает нужный вариант скрипта (`build` или `build-nolog`).

## Сообщество Phaser

- **Сайт:** [phaser.io](https://phaser.io), [Phaser Twitter](https://twitter.com/phaser_)
- **Игры:** [#madewithphaser](https://twitter.com/search?q=%23madewithphaser&src=typed_query&f=live)
- **Документация:** [API Docs](https://newdocs.phaser.io), [форум](https://phaser.discourse.group/), [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)
- **Discord:** [discord.gg/phaser](https://discord.gg/phaser)
- **Примеры:** [2000+ примеров](https://labs.phaser.io)
- **Рассылка:** [Phaser World](https://phaser.io/community/newsletter)

Шаблон создан [Phaser Studio](mailto:support@phaser.io). Логотип и персонажи Phaser &copy; 2011 - 2025 Phaser Studio Inc. Все права защищены.
