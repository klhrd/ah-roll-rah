// js/levelManager.js

export const LevelManager=
{
    cache:{},
    totalLevels:0,

    async init()
    {
        let id=1;
        while(true)
        {
            const data=await this.getLevel(id);
            console.log(data);
            if(!data)break; // break, not return
            id++;
            
        }

        this.totalLevels=id-1;
        console.log(`logged ${this.totalLevels} levels`);
        return this.totalLevels;
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