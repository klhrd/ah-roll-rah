// js/scenes/menuScenes.js

import { LevelManager } from "../levelManager.js";
import { Router } from "../router.js";

/*

width
(1.00-0.04*5)/4=0.20

height
(1.00-0.04*5)/4=0.20

*/

export const MenuScene=
{
    canvas: null,
    currentPage:0,
    totalPage:1,
    PAGE_SIZE:12,

    navButtons:
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
        {
            id:'prev-btn',
            text:'<PREV',
            textSizeRatio:0.8,
            xRatio:0.04,
            yRatio:0.87,
            widthRatio:0.20,
            heightRatio:0.1,
            onClick:()=>
            {
                MenuScene.changePage(-1);
            }
        },
        {
            id:'next-btn',
            text:'NEXT>',
            textSizeRatio:0.8,
            xRatio:0.76,
            yRatio:0.87,
            widthRatio:0.20,
            heightRatio:0.1,
            onClick:()=>
            {
                MenuScene.changePage(+1);
            }
        },
    ],

    renderedBtns:[],

    async init(page=0,canvas)
    {
        this.canvas=canvas;

        if(typeof LevelManager.init()!=="function")
        {
            await LevelManager.init();
        }

        const total=LevelManager.totalLevels||1;
        this.totalPage=Math.ceil(total/this.PAGE_SIZE);

        this.currentPage=Math.min(Math.max(0,page),Math.max(0,this.totalPage-1));

        this.bindInput();
    },

    changePage(dir)
    {
        const target=this.currentPage+dir;
        if(target>=0&&target<this.totalPage)
        {
            Router.go(`#menu-${target+1}`);
        }
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
        ctx.font=`bold ${40*width/800}px "Press Start 2P", monospace`;
        ctx.textAlign="center";
        ctx.fillText('AH-ROLL-RAH',width/2,height*0.10);

        // # btns
        const dynamicBtns=[];
        const startIdx=this.currentPage*this.PAGE_SIZE+1;
        const endIdx=Math.min(startIdx+this.PAGE_SIZE-1,LevelManager.totalLevels);
        // console.log(`startIdx: ${startIdx}, endIdx: ${endIdx}`);

        const colCount=4;
        const btnW=0.20;
        const btnH=0.20;
        const gapX=0.04;
        const gapY=0.03;
        const startY=0.18;
        const levelBtnTextRatio=0.8;
        
        for(let i=startIdx;i<=endIdx;i++)
        {
            const pageOffset=i-startIdx;                // 0-11
            const col=pageOffset%colCount;              // 0-3
            const row=Math.floor(pageOffset/colCount);  // 0-2

            dynamicBtns.push(
            {
                id:`start-level-${String(i)}`,
                text:`${String(i)}`,
                textSizeRatio:levelBtnTextRatio,
                xRatio:gapX+col*(btnW+gapX),
                yRatio:startY+row*(btnH+gapY),
                widthRatio:btnW,
                heightRatio:btnH,
                onClick:()=>Router.go(`#level-${String(i)}`)
            });

        }

        const allBtns=[...this.navButtons,...dynamicBtns];
        // console.log(allBtns);

        // render btns
        allBtns.forEach((btn)=>
        {
            if(btn.id==="prev-btn"&&this.currentPage===0)return;
            if(btn.id==="next-btn"&&this.currentPage>=this.totalPage-1)return;

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
            ctx.font=`${32*width/800*btn?.textSizeRatio??1}px "Press Start 2P"`;
            ctx.textBaseline='middle';
            if(btn.id.startsWith("start-"))
            {
                ctx.fillText(btn.text,x+w/2-0.2*w,y+h/2);
            }
            else
            {
                ctx.fillText(btn.text,x+w/2,y+h/2);
            }
        });

        //console.log(allBtns);
    },

    destroy()
    {
        if(this.handleClick)
        {
            this.canvas.removeEventListener('click',this.handleClick);
        }
    }

};