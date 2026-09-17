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
        const horizonY=height*0.9;
        const fov=300;
        // scale = \frac{fov}{fov+relZ*60}

        // # draw tiles
        // oh wait isnt that painter's algorithm
        const cameraZ=this.ball.z;
        const startRow=Math.max(0,Math.floor(cameraZ));
        const endRow=Math.min(this.map.length,startRow+50);

        for(let r=endRow-1;r>=startRow;r--)
        {
            for(let c=0;c<this.cols;c++) // c++
            {
                // ignore behind body
                const relZ=(r-cameraZ)-4;
                if(relZ<=0.1)continue;

                const scale=fov/(fov+relZ*60);

                // 3d(c,r)->2d(tileCenterX,tileY)
                const tileCenterX=width/2+(c-(this.cols-1)/2)*80*scale;
                const tileY=horizonY+(relZ*-30)*scale;
                const renderTileWidth=75*scale;
                const renderTileHeight=35*scale;

                const tileType=this.map[r][c];
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

                ctx.fillRect(
                    tileCenterX-renderTileWidth/2,
                    tileY,
                    renderTileWidth,
                    renderTileHeight
                );
            }
        }

        // # ball
        const ballScreenX=width/2+(this.ball.x-(this.cols-1)/2)*80*0.83;
        const ballScreenY=horizonY+(1.5*40)*0.83-15;
        const ballRadius=16;

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