// js/levelManager.js

export const LevelManager=
{
    cache:{},
    levelsList:[],
    totalLevels:0,

    async init()
    {
        try
        {
            const response=await fetch("./levels/index.json");
            if(!response.ok)
            {
                throw new Error(`failed to load level manifest`);
            }

            this.levelsList=await response.json();
            this.totalLevels=this.levelsList.length;
            console.log(`logged ${this.totalLevels} levels`);
            return this.totalLevels;
        }
        catch(error)
        {
            this.totalLevels=0;
            console.error("failed to init LevelManager: ",error);
            return this.totalLevels;
        }
    },

    async getLevel(levelId)
    {
        if(!!this.cache[levelId])
        {
            return this.cache[levelId];
        }

        try
        {
            const response=await fetch(`./levels/level_${levelId}.json`);
            if(!response.ok)
            {
                throw new Error(`failed to fetch, levelId: ${levelId}`);
            }
            const data=await response.json();

            this.cache[levelId]=data;
            return data;
        }
        catch(error)
        {
            console.error(`failed to load level`,error);
            return null;
        }
    }

};