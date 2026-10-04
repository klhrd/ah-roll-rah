// js/scenes/homeScene.js

import { Router } from "../router.js";
import { CONFIG } from "../config.js";
/*

*/

export const HomeScene=
{
    canvas: null,

    buttons:
    [
        {
            id:'go-menu',
            text:'PLAY',
            textSizeRatio:1.5,
            xRatio:0.30,
            yRatio:0.40,
            widthRatio:0.40,
            heightRatio:0.20,
            onClick:()=>Router.go('#menu')
        },
        {
            id:'go-info',
            text:'i',
            textSizeRatio:0.5,
            xRatio:0.92,
            yRatio:0.9,
            widthRatio:0.06,
            heightRatio:0.08,
            onClick:()=>
            {
                Router.go('#info')
            }
        },
    ],

    renderedBtns:[],

    init(canvas)
    {
        this.canvas=canvas;
        this.bindInput();
    },

    bindInput()
    {
        this.handleClick=(e)=>
        {
            const rect=this.canvas.getBoundingClientRect();

            const clickX=e.clientX-rect.left;
            const clickY=e.clientY-rect.top;

            for(const btn of this.renderedBtns)
            {
                if(clickX>=btn.x&&clickX<=btn.x+btn.w&&clickY>=btn.y&&clickY<=btn.y+btn.h)
                {
                    btn.onClick();
                    break;
                }
            }
        };

        this.canvas.addEventListener('click',this.handleClick);
    },

    update()
    {
        //????
    },

    draw(ctx)
    {
        const width=this.canvas.width;
        const height=this.canvas.height;
        this.renderedBtns=[];
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle="#1a1a2e";
        ctx.fillRect(0,0,width,height);

        // title
        ctx.fillStyle="#e0e0ff";
        ctx.font=`bold ${60*width/800}px "Press Start 2P", monospace`;
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText('AH-ROLL-RAH',width*0.5,height*0.2);
        
        // render btns
        this.buttons.forEach((btn)=>
        {
            const x=width*btn.xRatio;
            const y=height*btn.yRatio;
            const w=width*btn.widthRatio;
            const h=height*btn.heightRatio;

            this.renderedBtns.push({x:x,y:y,w:w,h:h,onClick:btn.onClick});

            ctx.fillStyle='#303050';
            ctx.fillRect(x,y,w,h);

            ctx.strokeStyle='#dddddd';
            ctx.lineWidth=5*width/800*btn.textSizeRatio;
            ctx.strokeRect(x+10,y+10,w-20,h-20);

            ctx.fillStyle='#eeeeee';
            ctx.font=`${32*width/800*btn.textSizeRatio}px "Press Start 2P"`;
            ctx.textAlign="center";
            ctx.textBaseline='middle';
            ctx.fillText(btn.text,x+w/2,y+h/2);
        });

        // info
        ctx.fillStyle='#aaaaaa';
        ctx.font=`${16*width/800}px "Press Start 2P"`;
        ctx.textAlign="center";
        ctx.textBaseline='middle';
        ctx.fillText(`${CONFIG.versionText} | PRESS PLAY TO START`,width*0.5,height*0.9);
    },

    destroy()
    {
        if(this.handleClick)
        {
            this.canvas.removeEventListener('click',this.handleClick);
        }
    }

};