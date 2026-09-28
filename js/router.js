// js/router.js

export const Router=
{
    init(onRouteChange)
    {
        const handleHashChange=()=>
        {
            const hash=window.location.hash||'home';

            if(hash==='#home')
            {
                onRouteChange('home');
            }
            else if(hash==='#menu')
            {
                onRouteChange('menu');
            }
            else if(hash.startsWith('#level-'))
            {
                const levelId=hash.replace('#level-','');
                onRouteChange('game',levelId);
            }
            else if(hash.startsWith('#result-'))
            {
                // ex: #result-1-win
                const parts=hash.replace('#result-','').split('-');
                const levelId=parts[0];
                const isWin=parts[1]==='win';
                onRouteChange('result',levelId,isWin);
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