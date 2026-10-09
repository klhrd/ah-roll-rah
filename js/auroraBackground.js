// js/auroraBackground.js

export class AuroraBg
{
    constructor(width,height)
    {
        this.width=width;
        this.height=height;
        this.time=0;

        this.config=
        {
            enviroment:
            {
                starCount:150,
                skyColors:["#010310","#030b1c","#051322"] // up to down
            }
        };

        this.stars=Array.from({length:this.config.enviroment.starCount},()=>
        ({
            x:Math.random()*this.width,
            y:Math.random()*this.height*0.8,
            radius:Math.random()*1.2+0.3,
            alpha:Math.random(),
            speed:Math.random()*0.03+0.01
        }));
    }

    update(speedMultiplier=1.0)
    {
        this.time+=0.01*speedMultiplier;
    }

    draw(ctx)
    {
        this.width=ctx.canvas.width;
        this.height=ctx.canvas.height;
        
        const skyGrad=ctx.createLinearGradient(0,0,0,this.height);
        const colors=this.config.enviroment.skyColors;
        skyGrad.addColorStop(0,colors[0]);
        skyGrad.addColorStop(0.6,colors[1]);
        skyGrad.addColorStop(1,colors[2]);
        ctx.fillStyle=skyGrad;
        ctx.fillRect(0,0,this.width,this.height);
        
        ctx.save();
        this.stars.forEach(s=>
        {
            s.alpha+=Math.sin(this.time*5*s.speed)*0.01;
            const a=Math.max(0.1,Math.min(s.alpha,1));
            ctx.fillStyle=`rgba(255,255,255,${a})`;
            ctx.beginPath();
            ctx.arc(s.x,s.y,s.radius,0,Math.PI*2);
            ctx.fill();
        });
        ctx.restore();
    }

    
}