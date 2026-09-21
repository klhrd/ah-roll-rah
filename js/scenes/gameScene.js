// scenes/gameScene.js
export const GameScene=
{
    map:[],
    speedZ:0.15,
    cols:5,
    ball:{x:0,z:0},
    canvas:null,
    handlePointerMove:null,

    init(levelData,canvas)
    {
        this.map=levelData.map;
        this.speedZ=levelData.speedZ;
        this.cols=levelData.cols;
        this.ball={x:(levelData.cols-1)/2,z:0};
        this.canvas=canvas;

        this.bindInput();
    },

    bindInput()
    {
        if(!this.canvas)return;

        const handlePointerMove=(e)=>
        {
            const rect=this.canvas.getBoundingClientRect();
            
            const clientX=e.touches?e.touches[0].clientX:e.clientX;
            const pointerXRatio=(clientX-rect.left)/rect.width;

            this.ball.x=Math.max(0,(Math.min((pointerXRatio*(this.cols-1)),(this.cols-1))));
        };

        window.addEventListener('pointermove',handlePointerMove);
    },

    update()
    {
        this.ball.z+=this.speedZ;

        const row=Math.floor(this.ball.z);
        const col=Math.round(this.ball.x);

        // 左右超出
        if(col<0||col>this.map[0].length)
        {
            this.onGameOver(false);
            return;
        }

        //超過終點
        if(row>this.map.length)
        {
            this.onGameOver(true);
            return;
        }

        const tileType=this.map[row][col];
        switch (tileType)
        {
            case 0:
            {
                this.onGameOver(false);
                break;
            }
            case 1:
            {
                break;
            }
            case 9:
            {
                this.onGameOver(true);
                break;
            }
            default:
            {
                console.error("non difine tile type: [",row,"][",col,"]: ",tileType);
                break;
            }
        }
    },

    draw(ctx)
    {
        const width=this.canvas.width;
        const height=this.canvas.height;
        
        // # clean all
        ctx.fillStyle='#1a1a2e'; // bg color
        ctx.fillRect(0,0,width,height);
        
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

        for(let r=endRow-1;r>=startRow;r--)
        {
            for(let c=0;c<this.cols;c++) // c++
            {
                const tileType=this.map[r][c];
                if(tileType===0)continue;

                const zNear=(r-cameraZ)+1;
                const zFar=zNear+1;
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
                const halfWidthNear=(baseColWidth*0.95/2)*scaleNear;
                const yFar=height-(zFar*rowHeightStep)*scaleFar;
                const centerXFar=width/2+(c-(this.cols-1)/2)*baseColWidth*scaleFar;
                const halfWidthFar=(baseColWidth*0.95/2)*scaleFar;

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
                    case 9:
                    {
                        ctx.fillStyle="#ff4060";
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
        const ballScreenX=width/2+(this.ball.x-(this.cols-1)/2)*baseColWidth*ballScale;
        const ballScreenY=height-(ballZ*rowHeightStep)*ballScale;
        const ballRadius=baseColWidth/2*0.6;

        ctx.beginPath();
        ctx.ellipse(ballScreenX,ballScreenY,ballRadius,ballRadius,0,0,Math.PI*2);
        ctx.fillStyle="#00000050";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ballScreenX,ballScreenY-20,ballRadius,0,Math.PI*2);
        ctx.fillStyle='#ff3070';
        ctx.fill();
        
        ctx.strokeStyle='#ffffff';
        ctx.lineWidth=2;
        ctx.stroke();        
    },

    onGameOver(isSuccess)
    {
        if(isSuccess)
        {
            //alert("Success!");
        }
        else
        {
            //alert("Fail!");
        }
    }
    // route go menu
};