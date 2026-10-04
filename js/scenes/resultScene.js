// js/scenes/resultScene.js

import { Router } from "../router.js";
import { CONFIG } from "../config.js";
import { LevelManager } from "../levelManager.js";

export const ResultScene=
{
    canvas: null,
    levelId:"1",
    isWin:true,
    levelData:null,

    buttons:
    [
        {
            id:'next-btn',
            text:'NEXT',
            textSizeRatio:1,
            xRatio:0.55,
            yRatio:0.18,
            widthRatio:0.36,
            heightRatio:0.16,
            showIfWin:null,
            onClick:()=>
            {
                Router.go(`#level-${String(Number(ResultScene.levelId)+1)}`);
            }
        },
        {
            id:'retry-btn',
            text:'RETRY',
            textSizeRatio:1,
            xRatio:0.55,
            yRatio:0.40,
            widthRatio:0.36,
            heightRatio:0.16,
            showIfWin:null,
            onClick:()=>
            {
                Router.go(`#level-${String(Number(ResultScene.levelId))}`);
            }
        },
        {
            id:'menu-btn',
            text:'MENU',
            textSizeRatio:1,
            xRatio:0.55,
            yRatio:0.62,
            widthRatio:0.36,
            heightRatio:0.16,
            showIfWin:null,
            onClick:()=>
            {
                Router.go(`#menu`);
            }
        },
        {
            id:'home-btn',
            text:'<HOME',
            textSizeRatio:0.5,
            xRatio:0.03,
            yRatio:0.85,
            widthRatio:0.15,
            heightRatio:0.10,
            showIfWin:false,
            onClick:()=>
            {
                Router.go(`#home`);
            }

        },
    ],

    renderedBtns:[],

    async init(levelId,isWin,canvas)
    {
        this.canvas=canvas;
        this.levelId=levelId;
        this.isWin=isWin;

        this.levelData=await LevelManager.getLevel(levelId);

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
                    console.log(btn,btn.onClick,"click");
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

        ctx.fillStyle="#1a1a2e50";
        ctx.fillRect(0,0,width,height);

        // title
        ctx.fillStyle=this.isWin?"#e0e0ff":"#ffe0e0";
        ctx.font=`bold ${60*width/800}px "Press Start 2P", monospace`;
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        if(this.isWin)
        {
            ctx.fillText("CLEAR!",width*0.3,height*0.3);
        }
        else
        {
            ctx.font=`bold ${67*width/800}px "Press Start 2P", monospace`; // 67
            ctx.fillText("GAME",width*0.3,height*0.28);
            ctx.fillText("OVER",width*0.3,height*0.40);
        }
        
        // info
        ctx.fillStyle='#cccccc';
        ctx.font=`${20*width/800}px "Press Start 2P"`;
        ctx.textAlign="center";
        ctx.textBaseline='middle';
        ctx.fillText(`Level ${this.levelId}`,width*0.29,height*0.56);
    
        // render btns
        this.buttons.forEach((btn)=>
        {
            const x=width*btn.xRatio;
            const y=height*btn.yRatio;
            const w=width*btn.widthRatio;
            const h=height*btn.heightRatio;
            
            if(btn.id==='next-btn'&&LevelManager.totalLevels<=this.levelId)
            {
                ctx.fillStyle='#aaaaaa';
                ctx.font=`${32*width/800*btn.textSizeRatio}px "Press Start 2P"`;
                ctx.textAlign="center";
                ctx.textBaseline='middle';
                ctx.fillText("The End",x+w/2,y+h/2);
                return;
            }
            
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

    },

    destroy()
    {
        if(this.handleClick)
        {
            this.canvas.removeEventListener('click',this.handleClick);
        }
    }

};