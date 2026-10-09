// js/auroraBackground.js

export class AuroraBg
{
    constructor(width,height)
    {
        this.width=width;
        this.height=height;
        this.time=0;

        this.LUT_SIZE=512;
        this.noiseLUT=new Float32Array(this.LUT_SIZE);
        for(let i=1;i<this.LUT_SIZE;i++)
        {
            this.noiseLUT[i]=Math.random();
        }

        this.config=
        {
            enviroment:
            {
                starCount:150,
                skyColors:["#010310","#030b1c","#051322"] // up to down
            },

            geometry:
            {
                renderStep:2,
                warpStrength:75,
                rayDensity:1.0,
            },

            layers:
            [
                {baseY:height*0.15,height:height*0.45,speed:0.55,amp1:50,amp2:30},
                {baseY:height*0.20,height:height*0.50,speed:0.40,amp1:60,amp2:35},
                {baseY:height*0.12,height:height*0.40,speed:0.75,amp1:40,amp2:20}
            ]


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

    fastNoise1D(x)
    {
        const xi=Math.floor(x);
        const f=x-xi;
        const u=f*f*(3-2*f); // hermite
        const i0=xi&(this.LUT_SIZE-1);
        const i1=(xi+1)&(this.LUT_SIZE-1);
        return this.noiseLUT[i0]*(1.0-u)+this.noiseLUT[i1]*u;
    }

    update(speedMultiplier=1.0)
    {
        this.time+=0.01*speedMultiplier;
    }

    draw(ctx)
    {
        this.width=ctx.canvas.width;
        this.height=ctx.canvas.height;
        
        // sky
        const skyGrad=ctx.createLinearGradient(0,0,0,this.height);
        const colors=this.config.enviroment.skyColors;
        skyGrad.addColorStop(0,colors[0]);
        skyGrad.addColorStop(0.6,colors[1]);
        skyGrad.addColorStop(1,colors[2]);
        ctx.fillStyle=skyGrad;
        ctx.fillRect(0,0,this.width,this.height);
        
        // stars
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

        //
        this.config.layers.forEach(l=>
        {
            this.drawAuroraLayer(ctx,l);
        });
    }

    drawAuroraLayer(ctx,layer)
    {
        const step=this.config.geometry.renderStep;

        ctx.save();
        ctx.strokeStyle="#80ffaa50";
        ctx.lineWidth=1;
        
        const t=this.time*layer.speed;

        for(let x=0;x<this.width;x+=step)
        {
            const sharpWarp=(1.0-Math.abs(Math.sin(x*0.04+t*0.5)))*this.config.geometry.warpStrength;
            const noiseWarp=(this.fastNoise1D(x*0.006-t*0.3)-0.5)*(this.config.geometry.warpStrength*0.93)
            const xw=x+sharpWarp+noiseWarp;

            const r1=(1.0-Math.abs(Math.sin(xw*0.0031+t)))*layer.amp1;
            const r2=Math.abs(Math.cos(xw*0.0073-t*0.8))*layer.amp2;
            const r3=Math.abs(Math.sin(xw*0.018-t*1.6))*18;

            const topY=layer.baseY=+r1-r2+r3;
            const currentHeight=layer.height*(0.8+(1.0-Math.abs(Math.sin(xw*0.005)))*0.35);

            ctx.beginPath();
            ctx.moveTo(x,topY);
            ctx.lineTo(x,topY+currentHeight);
            ctx.stroke();
            
        }
        ctx.restore();
    }

    
}