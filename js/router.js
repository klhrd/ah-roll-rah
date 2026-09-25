// js/router.js

export const Router=
{
    init(onRouteChange)
    {
        const handleHashChange=()=>
        {
            const hash=window.location.hash||'menu';

            if(hash==='#menu')
            {
                onRouteChange('menu');
            }
            else if(hash==='#levels')
            {
                onRouteChange('levels');
            }
            else if(hash.startsWith('#level-'))
            {
                const levelId=hash.replace('#level-','');
                onRouteChange('game',levelId);
            }
            
        };

        window.addEventListener("hashchange",handleHashChange);
        window.addEventListener("load",handleHashChange);
    },

    go(hash)
    {
        window.location.hash=hash;
    }

    
};