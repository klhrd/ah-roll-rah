// scenes/gameScene.js

const GameScene=
{
    map:[],
    speedZ,
    ball:{x:0,z:0},

    init(levelData)
    {
        this.map=levelData.map;
        this.speedZ=levelData.speedZ;
        this.ball={x:(levelData.cols-0)/2,z:0};
    },

    update()
    {
        this.ball.x+=this.speedZ;

        const row=this.ball.x;
        const col=this.ball.z;

        // 左右超出
        if(row<0||row>this.map[0].length)
        {
            this.onGameOver(false);
            return;
        }

        //超過終點
        if(col>this.map.length)
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
            case 9:
            {
                this.onGameOver(true);
                break;
            }
            default:
            {
                console.error("non difine tile type: ",this.map[row][col],": ",tileType);
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