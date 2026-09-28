// js/app.js
import {GameScene} from './scenes/gameScene.js';
import {MenuScene} from './scenes/menuScene.js';
import {HomeScene} from './scenes/homeScene.js';
import {LevelManager} from './levelManager.js';
import {Router} from './router.js';

/** @type {HTMLCanvasElement} */
const canvas=document.getElementById('main-canvas');
const ctx=canvas.getContext('2d');

let currentScene=null;

const DEV_MODE=false;
if (DEV_MODE)
{
    currentScene=GameScene;
    currentScene.init("1",canvas);
}
else
{
    currentScene=HomeScene;
    currentScene.init(canvas);   
}

Router.init((route,levelId)=>
{
    if(currentScene&&currentScene.destroy)
    {
        currentScene.destroy();
    }

    if(route==='home')
    {
        currentScene=HomeScene;
        currentScene.init(canvas);
    }
    else if(route==='menu')
    {
        currentScene=MenuScene;
        currentScene.init(canvas);
    }
    else if(route==='game')
    {
        currentScene=GameScene;
        currentScene.init(levelId,canvas);
    }
})

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