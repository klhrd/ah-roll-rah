// js/progressManager.js

const STORAGE_KAY='ah_roll_rah_progress';

export const ProgressManager=
{
    getCompletedLevels()
    {
        try
        {
            const data=localStorage.getItem(STORAGE_KAY);
            return data?JSON.parse(data):[];
        }
        catch(error)
        {
            console.error("failed to load progress: ",error);
            return [];
        }
    },

    isLevelCompleted(levelId)
    {
        const completed=this.getCompletedLevels();
        return completed.includes(Number(levelId));
    },

    markLevelCompleted(levelId)
    {
        const completed=this.getCompletedLevels();
        const id=Number(levelId);
        if(!completed.includes(id))
        {
            completed.push(id);
            try
            {
                localStorage.setItem(STORAGE_KAY,JSON.stringify(completed));
            }
            catch(error)
            {
                console.error("failed to save progress: ",error);
            }
        }
    }


};