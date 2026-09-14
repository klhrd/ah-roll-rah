// scenes/gameScene.js

const GameScene=
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


    onGameOver(isSuccess)
    {
        if(isSuccess)
        {
            alert("Success!");
        }
        else
        {
            alert("Fail!");
        }
    }
    // route go menu
};