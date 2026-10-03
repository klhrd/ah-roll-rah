// scenes/gameScene.js
import { LevelManager } from "../levelManager.js";
import { Router } from "../router.js";

export const GameScene=
{
    map:[],
    speedZ:0.15,
    cols:5,
    ball:{x:0,y:0,z:0}, // y:height
    canvas:null,
    handlePointerMove:null,

    levelData:null,
    isLoaded:false,

    state:'playing', // 'playing' | 'falling' | 'winning'
    animTimer:0,
    fallVy:0,
    ballVy:0,
    
    async init(levelId,canvas)
    {
        this.canvas=canvas;
        this.isLoaded=false;
        this.state='playing';
        this.animTimer=0;
        this.fallVy=0;
        this.ballVy=0;

        this.levelData=await LevelManager.getLevel(levelId);

        if(this.levelData)
        {
            this.isLoaded=true;
            console.log(`succeeded to load ${levelId}, levelData: `,this.levelData);
        }

        this.levelData
        this.map=this.levelData.map;
        this.speedZ=this.levelData.speedZ;
        this.cols=this.levelData.cols;
        this.ball={x:(this.levelData.cols-1)/2,y:0,z:0};

        this.bindInput();
    },

    bindInput()
    {
        if(!this.canvas)return;

        if(this.handlePointerMove)
        {
            window.removeEventListener('pointermove',this.handlePointerMove);
        }

        this.handlePointerMove=(e)=>
        {
            if(this.state!=="playing")return;

            const rect=this.canvas.getBoundingClientRect();
            const clientX=e.touches?e.touches[0].clientX:e.clientX;
            
            const canvasX=clientX-rect.left;
            const width=rect.width;

            // =draw()
            const maxTrackWidth=width*0.7;
            const baseColWidth=maxTrackWidth/this.cols;

            const trackLeftX=(width/2)-(maxTrackWidth/2);
            const colZeroCenterX=trackLeftX+(baseColWidth/2);
           
            this.ball.x=(canvasX-colZeroCenterX)/baseColWidth;
        };

        window.addEventListener('pointermove',this.handlePointerMove);
    },

    update()
    {
        if(!this.isLoaded)return;

        // falling
        if(this.state==="falling")
        {
            this.animTimer+=0.03;
            this.fallVy+=0.05;  // acc
            this.ball.y-=this.fallVy;

            if(this.animTimer>=1.0)
            {
                this.onGameOver(false);
            }
            return;
        }

        // winning
        if(this.state==="winning")
        {
            this.animTimer+=0.03;
            this.ball.z+=this.speedZ*0.5;

            if(this.animTimer>=1.0)
            {
                this.onGameOver(true);
            }
            return;
        }

        // leaping
        if(this.ball.y>0||this.ballVy>0)
        {
            this.ball.y+=this.ballVy;
            this.ballVy-=0.012;

            if(this.ball.y<=0)
            {
                this.ball.y=0;
                this.ballVy=0;
            }
        }

        this.ball.z+=this.speedZ;

        const row=Math.floor(this.ball.z);
        const col=Math.round(this.ball.x);

        // L/R edge
        if(col<0||col>=this.cols)
        {
            this.startFall();
            return;
        }

        // end line
        if(row>this.map.length)
        {
            this.startWin();
            return;
        }

        const tileType=this.map[row]?.[col]??0;
        
        // flying
        if(this.ball.y>0.1)return;

        switch (tileType)
        {
            case 0:     // 0: hole
            {
                this.startFall();
                break;
            }
            case 1:     // 1: normal ground
            {
                break;
            }
            case 2:     // 2: leap
            {
                this.ballVy=0.25;
                break;
            }
            case 9:     // 9: end
            {
                this.startWin();
                break;
            }
            default:
            {
                console.error("undefined tile type: [",row,"][",col,"]: ",tileType);
                break;
            }
        }
    },

    startFall()
    {
        if(this.state!=="playing")return;

        this.state="falling";
        this.animTimer=0;
        this.fallVy=0.05;
    },

    startWin()
    {
        if(this.state!=="playing")return;

        this.state="winning";
        this.animTimer=0;
    },

    draw(ctx)
    {
        const width=this.canvas.width;
        const height=this.canvas.height;
        
        // # loading
        if(!this.isLoaded)
        {
            ctx.fillStyle='#1a1a2e'; // bg color
            ctx.fillRect(0,0,width,height);
            ctx.fillStyle="#e0e0ff";
            ctx.font=`bold ${40*width/800}px "Press Start 2P", monospace`;
            ctx.textAlign="center";
            ctx.fillText('LOADING...',width*0.5,height*0.5);
        }

        // # clean all
        ctx.fillStyle='#1a1a2e'; // bg color
        ctx.fillRect(0,0,width,height);
        
        ctx.save();
        if(this.state==='winning')
        {
            const progress=Math.min(1,this.animTimer);
            const zoomScale=1+progress*2.0;
            const alpha=Math.max(0,1-progress*1.2);

            ctx.globalAlpha=alpha;
            
            ctx.translate(width*0.5, height*0.5);
            ctx.scale(zoomScale,zoomScale);
            ctx.translate(width*-0.5, height*-0.5);
        }

        // # perspective setting
        const horizonY=height*0.3;
        const fov=height*0.75;
        // scale = \frac{fov}{fov+relZ*60}

        const maxTrackWidth=width*0.7;
        const baseColWidth=maxTrackWidth/this.cols;
        const rowHeightStep=height*0.15;

        // # draw tiles
        // oh wait isnt that painter's algorithm
        const cameraZ=this.ball.z;
        const startRow=Math.max(0,Math.floor(cameraZ));
        const endRow=Math.min(this.map.length,startRow+50);

        const gapZ=0.9;
        const gapX=0.95;

        for(let r=endRow-1;r>=startRow;r--)
        {
            for(let c=0;c<this.cols;c++) // c++
            {
                const tileType=this.map[r][c];
                if(tileType===0)continue;

                const rowOffset=(1-gapZ)/2;
                const zNear=(r-cameraZ)+1+rowOffset;
                const zFar=zNear+gapZ;

                // ignore behind body
                if(zNear<=0.1)continue;
/*
scale = fov / fov+z*40
*/
                const scaleNear=fov/(fov+zNear*40);
                const scaleFar=fov/(fov+zFar*40);

                // ?
                const yNear=height-(zNear*rowHeightStep)*scaleNear;
                const centerXNear=width/2+(c-(this.cols-1)/2)*baseColWidth*scaleNear;
                const halfWidthNear=(baseColWidth*gapX/2)*scaleNear;
                const yFar=height-(zFar*rowHeightStep)*scaleFar;
                const centerXFar=width/2+(c-(this.cols-1)/2)*baseColWidth*scaleFar;
                const halfWidthFar=(baseColWidth*gapX/2)*scaleFar;

                switch (tileType)
                {
                    case 0:
                    {
                        ctx.fillStyle="#00000000";
                        break;
                    }
                    case 1:
                    {
                        ctx.fillStyle=(r%2===0)?"#444444":"#666666";
                        break;
                    }
                    case 2:
                    {
                        ctx.fillStyle="#7bb37b";
                        break;
                    }
                    case 9:
                    {
                        ctx.fillStyle="#ff7575";
                        break;
                    }
                }

                // trapezium
/*
                
                     1_______________2
                     /               \   
                    /                 \  
                   /                   \ 
                  /                     \
                 /                       \
                /_________________________\
               4                           3

*/
                ctx.beginPath();
                ctx.moveTo(centerXFar-halfWidthFar, yFar);
                ctx.lineTo(centerXFar+halfWidthFar, yFar);
                ctx.lineTo(centerXNear+halfWidthNear, yNear);
                ctx.lineTo(centerXNear-halfWidthNear, yNear);
                ctx.closePath();
                ctx.fill();

            }
        }

        // # ball
        const ballZ=1;
        const ballScale=fov/(fov+ballZ*40);

        const shadowScreenX=width/2+(this.ball.x-(this.cols-1)/2)*baseColWidth*ballScale;
        const shadowScreenY=height-(ballZ*rowHeightStep)*ballScale;
        const baseBallRadius=baseColWidth/2*0.6;

        const jumpHeight=(this.ball?.y||0)*baseColWidth;
        let shadowScale=Math.min(1,1+jumpHeight/150);
        let shadowAlpha=Math.max(0.1,0.5-jumpHeight/200);

        let renderBallRadius=baseBallRadius;
        if(this.state==="falling")
        {
            const fallProgress=Math.min(1,this.animTimer); // 0->1
            shadowAlpha*=(1-fallProgress);
            shadowScale*=(1-fallProgress);

            renderBallRadius=Math.max(0,baseBallRadius*(1-fallProgress*0.8));
        }

        if(this.state!=="falling"||this.animTimer<0.8)
        {
            if(shadowScale>0)
            {
                ctx.beginPath();
                ctx.ellipse(
                    shadowScreenX,
                    shadowScreenY,
                    baseBallRadius*shadowScale,
                    baseBallRadius*shadowScale*0.4,
                    0,0,Math.PI*2);
                ctx.fillStyle=`rgba(0,0,0,${shadowAlpha})`;
                ctx.fill();
            }
        }

        const ballScreenX=shadowScreenX;
        const ballScreenY=shadowScreenY-jumpHeight-renderBallRadius*0.5;

        if(renderBallRadius>0)
        {
            ctx.beginPath();
            ctx.arc(ballScreenX,ballScreenY-20,renderBallRadius,0,Math.PI*2);
            ctx.fillStyle='#ff3070';
            ctx.fill();
            
            ctx.strokeStyle='#ffffff';
            ctx.lineWidth=2*width/800;
            ctx.stroke();  
        }
        
        ctx.restore();
        
    },

    onGameOver(isSuccess)
    {
        if(isSuccess)
        {
            Router.go(`#result-${this.levelData.id}-win`);
            console.log(`go #result-${this.levelData.id}-win`);

        }
        else
        {
            Router.go(`#result-${this.levelData.id}-fail`);
            console.log(`go #result-${this.levelData.id}-fail`);
        }
    },
    
    destroy()
    {
        if(this.handlePointerMove)
        {
            window.removeEventListener('pointermove',this.handlePointerMove);
        }
    }
};