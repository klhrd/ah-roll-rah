// js/auroraBackground.js

const STORAGE_KEY='ah_roll_rah_aurora_enabled'

export class AuroraBg
{
    constructor(width,height)
    {
        this.width=width;
        this.height=height;
        this.time=0;

        this.enabled=true;

        const savedState=localStorage.getItem(STORAGE_KEY);
        this.enabled=savedState!==null?JSON.parse(savedState):true;


        this.LUT_SIZE=512;
        this.noiseLUT=new Float32Array(this.LUT_SIZE);
        for(let i=1;i<this.LUT_SIZE;i++)
        {
            this.noiseLUT[i]=Math.random();
        }

        this.config=
        {
            animation:
            {
                globalSpeed:1.0,
                waveMoveSpeed:1.0,
                rayFlickerSpeed:1.2
            },

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

            colorProfile:
            {
                pinkLimitY:height*0.25,     // upper sky
                violetStartY:height*0.55,   // lower sky
                pinkHue:325,
                violetHue:280,
                stops:
                {
                    top:            0.00,
                    upperGlow:      0.15,
                    mainBody:       0.40,
                    lowerBright:    0.65,
                    bottomFringe:   0.88,
                    bottomFade:     1.00,
                }
            },

            brightness:
            {
                minOpacity:0.05,
                maxOpacity:1.00,
                baseRayOpacity:0.15,
                rayIntensity:0.55,
                peakPower:1.8,
                peakBrightnessBoost:0.75
            },

            layers:
            [
                {baseY:height*0.15,height:height*0.45,speed:0.55,amp1:50,amp2:30,mainHue:150},  // green
                {baseY:height*0.20,height:height*0.50,speed:0.40,amp1:60,amp2:35,mainHue:165},  // blue/green
                {baseY:height*0.12,height:height*0.40,speed:0.75,amp1:40,amp2:20,mainHue:140},  // mint green
                {baseY:height*0.25,height:height*0.55,speed:0.30,amp1:60,amp2:40,mainHue:155}
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

    resize(width,height)
    {
        this.width=width;
        this.height=height;
        
        this.config.colorProfile.pinkLimitY=height*0.25,     // upper sky
        this.config.colorProfile.violetStartY=height*0.55,   // lower sky
        this.config.layers=
        [
            {baseY:height*0.15,height:height*0.45,speed:0.55,amp1:50,amp2:30,mainHue:150},  // green
            {baseY:height*0.20,height:height*0.50,speed:0.40,amp1:60,amp2:35,mainHue:165},  // blue/green
            {baseY:height*0.12,height:height*0.40,speed:0.75,amp1:40,amp2:20,mainHue:140},  // mint green
            {baseY:height*0.25,height:height*0.55,speed:0.30,amp1:60,amp2:40,mainHue:155}
        ];

        this.stars=Array.from({length:this.config.enviroment.starCount},()=>
        ({
            x:Math.random()*this.width,
            y:Math.random()*this.height*0.8,
            radius:Math.random()*1.2+0.3,
            alpha:Math.random(),
            speed:Math.random()*0.03+0.01
        }));
    }

    toggle()
    {
        this.enabled=!this.enabled;
        this.saveState();
        return this.enabled;
    }

    setEnabled(val)
    {
        this.enabled=Boolean(val);
        this.saveState();
    }

    saveState()
    {
        try
        {
            localStorage.setItem(STORAGE_KEY,JSON.stringify(this.enabled));
        }
        catch(e)
        {
            console.error('fail to save: ',e);
        }
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
        this.time+=0.01*speedMultiplier*this.config.animation.globalSpeed;
    }

    draw(ctx)
    {
        this.width=ctx.canvas.width;
        this.height=ctx.canvas.height;
        
        if(!this.enabled)
        {
            ctx.fillStyle="#1a1a2e";
            ctx.fillRect(0,0,this.width,this.height);
            return;
        }

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

        // aurora
        this.config.layers.forEach(l=>
        {
            this.drawAuroraLayer(ctx,l);
        });
    }

    drawAuroraLayer(ctx,layer)
    {
        const step=this.config.geometry.renderStep;
        const cfg=this.config;

        ctx.save();
        ctx.globalCompositeOperation='lighter';
        
        const t=this.time*layer.speed;
        const rayTime=this.time*cfg.animation.rayFlickerSpeed;

        const ATM_PINK_LIMIT=cfg.colorProfile.pinkLimitY;
        const ATM_VIOLET_START=cfg.colorProfile.violetStartY;
        
        for(let x=0;x<this.width;x+=step)
        {
            const stepBlock=Math.floor((x+t*40)*0.015);
            const stepShift=Math.abs(Math.sin(stepBlock*1.7))*20;

            const sharpWarp=(1.0-Math.abs(Math.sin(x*0.04+t*0.5)))*cfg.geometry.warpStrength;
            const noiseWarp=(this.fastNoise1D(x*0.006-t*0.3)-0.5)*(cfg.geometry.warpStrength*0.93)
            const xw=x+sharpWarp+noiseWarp;

            const r1=(1.0-Math.abs(Math.sin(xw*0.0031+t)))*layer.amp1;
            const r2=Math.abs(Math.cos(xw*0.0073-t*0.8))*layer.amp2;
            const r3=Math.abs(Math.sin(xw*0.018-t*1.6))*18;

            const topY=layer.baseY=+r1-r2+r3;
            const currentHeight=layer.height*(0.8+(1.0-Math.abs(Math.sin(xw*0.005)))*0.35);
            const bottomY=topY+currentHeight;

            const rayFreq=cfg.geometry.rayDensity;
            const noiseRay=this.fastNoise1D(x*0.03*rayFreq+rayTime*1.2);
            const sharpRay=1.0-Math.abs(Math.sin(x*0.08*rayFreq+rayTime*2.5)*Math.cos(x*0.15*rayFreq-rayTime))
            const rayNoise=noiseRay*0.5+sharpRay*0.5;

            const peakFactor=Math.pow(r1/layer.amp1,cfg.brightness.peakPower);
            const alphaMod=(cfg.brightness.baseRayOpacity+rayNoise*cfg.brightness.rayIntensity)*
                            (0.55+peakFactor*cfg.brightness.peakBrightnessBoost);

            const grad=ctx.createLinearGradient(0,topY,0,bottomY);
            const baseHue=layer.mainHue;
            const stops=cfg.colorProfile.stops;

            // upper sky
            if(topY<ATM_PINK_LIMIT)
            {
                const pinkStrength=Math.min(1,(ATM_PINK_LIMIT-topY)/80);
                grad.addColorStop(stops.top,`hsla(${cfg.colorProfile.pinkHue+5},90%,65%,0)`);
                grad.addColorStop(stops.upperGlow,`hsla(${cfg.colorProfile.pinkHue},95%,${60+peakFactor*20}%,${0.1+pinkStrength*0.35})`);
            }
            else
            {
                grad.addColorStop(stops.top,`hsla(${baseHue},90%,60%,0)`);
            }

            // mid skj
            grad.addColorStop(stops.mainBody,`hsla(${baseHue},100%,52%,0.28)`);
            grad.addColorStop(stops.lowerBright,`hsla(${baseHue+20},100%,72%,${0.18+peakFactor*0.35})`);

            // lower sky
            if(bottomY>ATM_VIOLET_START)
            {
                const violetStrength=Math.min(1,(bottomY-ATM_VIOLET_START)/100);
                grad.addColorStop(stops.bottomFringe,`hsla(${cfg.colorProfile.violetHue+5},95%,65%,${0.1+violetStrength*0.35})`);
                grad.addColorStop(stops.bottomFade,`hsla(${cfg.colorProfile.violetHue-10},85%,35%,0)`);
            }
            else
            {
                grad.addColorStop(stops.bottomFringe,`hsla(${baseHue+35},80%,40%,0.08)`);
                grad.addColorStop(stops.bottomFade,`hsla(${baseHue+55},70%,30%,0)`);
            }

            ctx.globalAlpha=Math.min(cfg.brightness.maxOpacity,Math.max(cfg.brightness.minOpacity,alphaMod));
            
            ctx.fillStyle=grad;
            ctx.fillRect(x,topY,step,currentHeight);
            
        }
        ctx.restore();
    }

    
}