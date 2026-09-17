// js/app.js
import {GameScene} from './scenes/gameScene.js';
import {Levels} from './levels.js';

/** @type {HTMLCanvasElement} */
const canvas=document.getElementById('main-canvas');
const ctx=canvas.getContext('2d');

GameScene.init(Levels["1"],canvas);

function gameLoop()
{
    GameScene.update();
    GameScene.draw(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();