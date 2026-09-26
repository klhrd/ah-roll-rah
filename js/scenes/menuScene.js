// js/scenes/menuScenes.js

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

    buttons:
    [
        {
            id:'start-level-1',
            text:'1',
            xRatio:0.04,
            yRatio:0.28,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-1')
        },
        {
            id:'start-level-2',
            text:'2',
            xRatio:0.28,
            yRatio:0.28,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-2')
        },
        {
            id:'start-level-3',
            text:'3',
            xRatio:0.52,
            yRatio:0.28,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-3')
        },
        {
            id:'start-level-4',
            text:'4',
            xRatio:0.76,
            yRatio:0.28,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-4')
        },

        {
            id:'start-level-5',
            text:'5',
            xRatio:0.04,
            yRatio:0.52,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-5')
        },
        {
            id:'start-level-6',
            text:'6',
            xRatio:0.28,
            yRatio:0.52,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-6')
        },
        {
            id:'start-level-7',
            text:'7',
            xRatio:0.52,
            yRatio:0.52,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-7')
        },
        {
            id:'start-level-8',
            text:'8',
            xRatio:0.76,
            yRatio:0.52,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-8')
        },

        {
            id:'start-level-9',
            text:'9',
            xRatio:0.04,
            yRatio:0.76,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-9')
        },
        {
            id:'start-level-A',
            text:'A',
            xRatio:0.28,
            yRatio:0.76,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-A')
        },
        {
            id:'start-level-B',
            text:'B',
            xRatio:0.52,
            yRatio:0.76,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-B')
        },
        {
            id:'start-level-C',
            text:'C',
            xRatio:0.76,
            yRatio:0.76,
            widthRatio:0.20,
            heightRatio:0.20,
            onClick:()=>Router.go('#level-C')
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
        ctx.font='bold 40px "Press Start 2P", monospace';
        ctx.textAlign="center";
        ctx.fillText('AH-ROLL-AH',width/2,height*0.14);

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
            ctx.lineWidth=5;
            ctx.strokeRect(x+10,y+10,w-20,h-20);

            ctx.fillStyle='#eeeeee';
            ctx.font='32px "Press Start 2P"';
            ctx.textBaseline='middle';
            ctx.fillText(btn.text,x+w/2-w*0.2,y+h/2);
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