// js/app.js
import {GameScene} from './scenes/gameScene.js';
import {MenuScene} from './scenes/menuScene.js';
import {HomeScene} from './scenes/homeScene.js';
import {Levels} from './levels.js';

/** @type {HTMLCanvasElement} */
const canvas=document.getElementById('main-canvas');
const ctx=canvas.getContext('2d');

let currentScene=null;

const DEV_MODE=false;
if (DEV_MODE)
{
    currentScene=GameScene;
    currentScene.init(Levels["1"],canvas);
}
else
{
    currentScene=HomeScene;
    currentScene.init(canvas);   
}

function gameLoop()
{
    if(currentScene)
    {
        if(currentScene.update)currentScene.update();
        if(currentScene.draw)currentScene.draw(ctx);
    }
    

    requestAnimationFrame(gameLoop);
}

gameLoop();