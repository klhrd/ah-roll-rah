// js/app.js
import {GameScene} from './scenes/gameScene.js';
import {MenuScene} from './scenes/menuScene.js';
import {HomeScene} from './scenes/homeScene.js';
import {InfoScene} from './scenes/infoScene.js';
import {ResultScene} from './scenes/resultScene.js';
import {LevelManager} from './levelManager.js';
import {Router} from './router.js';
import {AuroraBg} from './auroraBackground.js';

/** @type {HTMLCanvasElement} */
const canvas=document.getElementById('main-canvas');
const ctx=canvas.getContext('2d');
let width=canvas.width;
let height=canvas.height;
let auroraBg=new AuroraBg(canvas.width,canvas.height);
let currentScene=null;

gameLoop();
resizeCanvas();
LevelManager.init();

const DEV_MODE=false;
if (DEV_MODE)
{
    currentScene=ResultScene;
    currentScene.init("1",true,canvas);
}
else
{
    currentScene=HomeScene;
    currentScene.init(canvas);   
}

Router.init((route,p1,p2)=>
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
    else if(route==='info')
    {
        currentScene=InfoScene;
        currentScene.init(canvas,auroraBg);
    }
    else if(route==='menu')
    {
        currentScene=MenuScene;
        currentScene.init(p1,canvas);
    }
    else if(route==='game')
    {
        currentScene=GameScene;
        currentScene.init(p1,canvas);
    }
    else if(route==='result')
    {
        currentScene=ResultScene;
        currentScene.init(p1,p2,canvas);
    }
})


let clientX=0;
let clientY=0;
let pointerXRatio=0;
let pointerYRatio=0;

const logPointerXY=(e)=>
{
    const rect=canvas.getBoundingClientRect();

    clientX=e.touches?e.touches[0].clientX:e.clientX;
    clientY=e.touches?e.touches[0].clientY:e.clientY;
    pointerXRatio=(clientX-rect.left)/rect.width;
    pointerYRatio=(clientY-rect.top)/rect.height;
};
window.addEventListener('pointermove',logPointerXY);

function resizeCanvas()
{
    canvas.width=canvas.clientWidth;
    canvas.height=canvas.clientHeight;

    width=canvas.width;
    height=canvas.height;
    if(currentScene)
    {
        if(currentScene.update)currentScene.update();
        if(currentScene.draw)currentScene.draw(ctx);
    }    
}
window.addEventListener('resize',resizeCanvas);

function gameLoop()
{
    if(auroraBg)auroraBg.update();
    if(currentScene&&currentScene.update)
    {
        if(currentScene.update)currentScene.update();
    }

    if(auroraBg)auroraBg.draw(ctx);
    if(currentScene&&currentScene.draw)
    {
        if(currentScene.draw)currentScene.draw(ctx);
    }
    
    //console.log(`WH: (${width},${height})\npointerXYRatio: \n(${pointerXRatio},${pointerYRatio})\npointerXY: \n(${pointerXRatio*width},${pointerYRatio*height})`);
    requestAnimationFrame(gameLoop);
}