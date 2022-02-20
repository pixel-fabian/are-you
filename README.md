# Phaser 3 Template 🎮

![GitHub](https://img.shields.io/github/license/pixel-fabian/phaser-blueprint?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/pixel-fabian/phaser-blueprint?style=flat-square)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/pixel-fabian/phaser-blueprint?style=flat-square)

---

Template to create a game with [phaser 3](https://phaser.io/) and typescript.

## Features

- Basic phaser scenes
- [TypeScript](https://www.typescriptlang.org/) support
- [webpack](https://webpack.js.org/) to bundle JS
- [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to format code

> Note: There is no webserver included. I usually use a the Live Server extension form VSCode as a development server.

## Installation

Prerequisite: Have [node.js](https://nodejs.org) and npm installed.

1. Clone or download this repository
2. Install dependencies `npm install`

## Usage

1. Start watcher `npm start`
2. Make changes
3. Compiled JavaScript will be in `dist/js` folder

### Folder structure

```
dist/             // everything to run the game

  assets/         // static asset files (audio & images)
  css/            // styles
  js/             // generated JS (by webpack)
  index.html
```

```
src/js/           // Typescript code, needs compiling
  scenes/         // Phaser scenes
  constants/      // Constants e.g. to manage scene or texture keys
```

```
root              // config files
```

### Phaser scenes

```
sceneLoad        // Pre-Load all assets with loading bar
sceneMenu        // Main menu
sceneGame        // Add gameplay here
```

### Build for production

`npm run build`

## Licence

[MIT](/LICENSE)
