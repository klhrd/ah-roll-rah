// js/levelManager.js

export const LevelManager=
{
    cache:{},

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