// js/scenes/infoScene.js

import { Router } from "../router.js";
import { CONFIG } from "../config.js";
/*

*/

export const InfoScene=
{
    canvas: null,

    buttons:
    [
        {
            id:'back-home',
            text:'<',
            textSizeRatio:0.8,
            xRatio:0.04,
            yRatio:0.04,
            widthRatio:0.10,
            heightRatio:0.1,
            onClick:()=>
            {
                Router.go('#home')
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

        // title
        ctx.fillStyle="#e0e0ff";
        ctx.font=`bold ${30*width/800}px "Press Start 2P", monospace`;
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText('information',width*0.5,height*0.2);
        
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
            ctx.lineWidth=5*width/800;
            ctx.strokeRect(x+10,y+10,w-20,h-20);

            ctx.fillStyle='#eeeeee';
            ctx.font=`${32*width/800}px "Press Start 2P"`;
            ctx.textAlign="center";
            ctx.textBaseline='middle';
            ctx.fillText(btn.text,x+w/2,y+h/2);
        });

        // info
        ctx.fillStyle='#aaaaaa';
        ctx.font=`${16*width/800}px "Press Start 2P"`;
        ctx.textAlign="left";
        ctx.textBaseline='middle';
        ctx.fillText(`AUTHOR`,width*0.1,height*0.35);
        ctx.fillText(CONFIG.AUTHOR,width*0.30,height*0.35);
        ctx.fillText(`GAMENAME`,width*0.1,height*0.5);
        ctx.fillText(CONFIG.GAME_NAME,width*0.30,height*0.5);
        ctx.fillText(`VERSION`,width*0.1,height*0.65);
        ctx.fillText(CONFIG.VERSION,width*0.30,height*0.65);
    },

    destroy()
    {
        if(this.handleClick)
        {
            this.canvas.removeEventListener('click',this.handleClick);
        }
    }

};