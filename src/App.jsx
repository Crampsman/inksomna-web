import { useState, useEffect, useRef } from "react";

const BG  = "#0e0e0e";
const BG2 = "#0a0a0a";
const BG3 = "#080808";
const S1  = "#111111";
const BD  = "#1a1a1a";
const W   = "#ffffff";

/* ── contrast guide (on near-black bg) ──────────────────────────
   Headlines / CTAs  →  #fff
   Body copy         →  #999
   Secondary copy    →  #777
   Labels / caps     →  #666
   Nav links idle    →  #aaa
   Dividers          →  #1e1e1e / #1a1a1a
   Disabled / closed →  #444
─────────────────────────────────────────────────────────────────*/

const arts = [
  <svg key={0} viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.5}}>
    <ellipse cx="200" cy="200" rx="130" ry="170" fill="none" stroke="#fff" strokeWidth=".8"/>
    <ellipse cx="200" cy="200" rx="95"  ry="130" fill="none" stroke="#444" strokeWidth=".4"/>
    <ellipse cx="200" cy="200" rx="58"  ry="80"  fill="none" stroke="#fff" strokeWidth=".6"/>
    <circle  cx="200" cy="200" r="22"   fill="none" stroke="#fff" strokeWidth="1.2"/>
    <circle  cx="200" cy="200" r="7"    fill="#fff" opacity=".6"/>
    <line x1="200" y1="30"  x2="200" y2="70"  stroke="#333" strokeWidth=".5"/>
    <line x1="200" y1="330" x2="200" y2="370" stroke="#333" strokeWidth=".5"/>
    <line x1="70"  y1="200" x2="105" y2="200" stroke="#333" strokeWidth=".5"/>
    <line x1="295" y1="200" x2="330" y2="200" stroke="#333" strokeWidth=".5"/>
    <path d="M200 370 C200 370,195 400,198 430 C201 460,200 490,200 500" fill="none" stroke="#fff" strokeWidth=".8" strokeLinecap="round"/>
    <circle cx="198" cy="432" r="4" fill="none" stroke="#fff" strokeWidth=".6"/>
  </svg>,
  <svg key={1} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.5}}>
    <ellipse cx="140" cy="160" rx="80" ry="110" fill="none" stroke="#fff" strokeWidth=".7"/>
    <ellipse cx="140" cy="120" rx="44" ry="56"  fill="none" stroke="#aaa" strokeWidth=".5"/>
    <circle  cx="126" cy="112" r="10" fill="none" stroke="#ccc" strokeWidth=".8"/>
    <circle  cx="154" cy="112" r="10" fill="none" stroke="#ccc" strokeWidth=".8"/>
    <circle  cx="126" cy="112" r="4"  fill="#888"/>
    <circle  cx="154" cy="112" r="4"  fill="#888"/>
    <path d="M130 136 Q140 148 150 136" fill="none" stroke="#ccc" strokeWidth=".8"/>
    <path d="M118 100 Q126 94 134 100" fill="none" stroke="#aaa" strokeWidth=".7"/>
    <path d="M146 100 Q154 94 162 100" fill="none" stroke="#aaa" strokeWidth=".7"/>
  </svg>,
  <svg key={2} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.55}}>
    <circle  cx="140" cy="140" r="88" fill="none" stroke="#444" strokeWidth=".4"/>
    <circle  cx="140" cy="140" r="62" fill="none" stroke="#fff" strokeWidth=".7"/>
    <polygon points="140,55 215,200 65,200"  fill="none" stroke="#fff" strokeWidth="1.2"/>
    <polygon points="140,225 65,80 215,80"   fill="none" stroke="#fff" strokeWidth="1.2"/>
    <circle  cx="140" cy="140" r="14" fill="none" stroke="#fff" strokeWidth=".8"/>
    {[0,60,120,180,240,300].map((a,i)=>{const r=a*Math.PI/180;return <line key={i} x1="140" y1="140" x2={140+Math.cos(r)*88} y2={140+Math.sin(r)*88} stroke="#222" strokeWidth=".4"/>;})}
  </svg>,
  <svg key={3} viewBox="0 0 280 380" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.48}}>
    <line x1="140" y1="370" x2="140" y2="60" stroke="#aaa" strokeWidth=".9" strokeLinecap="round"/>
    {[0,1,2,3].map(i=>{const y=340-i*70,d=i%2===0?-1:1;return(
      <g key={i}>
        <path d={`M140 ${y} C${140+d*28} ${y-18},${140+d*55} ${y-44},${140+d*50} ${y-65}`} fill="none" stroke="#aaa" strokeWidth=".8"/>
        <ellipse cx={140+d*50} cy={y-65} rx="13" ry="8" transform={`rotate(${d*-30},${140+d*50},${y-65})`} fill="none" stroke="#aaa" strokeWidth=".7"/>
      </g>);})}
    <ellipse cx="140" cy="55" rx="9" ry="13" fill="none" stroke="#aaa" strokeWidth=".8"/>
  </svg>,
  <svg key={4} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.48}}>
    <path d="M140 30 C140 30,100 90,80 150 C60 210,90 270,140 290 C190 270,220 210,200 150 C180 90,140 30,140 30Z" fill="none" stroke="#fff" strokeWidth=".8"/>
    <ellipse cx="140" cy="150" rx="30" ry="55" fill="none" stroke="#444" strokeWidth=".4"/>
    <circle  cx="140" cy="110" r="16" fill="none" stroke="#ccc" strokeWidth=".7"/>
    <circle  cx="140" cy="110" r="6"  fill="#777" opacity=".6"/>
    <path d="M130 220 Q140 240 150 220" fill="none" stroke="#ccc" strokeWidth=".6"/>
  </svg>,
  <svg key={5} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.48}}>
    {[0,1,2,3,4].map(i=><path key={i} d={`M40 ${110+i*32} Q80 ${82+i*32},140 ${110+i*32} Q200 ${138+i*32},240 ${110+i*32}`} fill="none" stroke="#aaa" strokeWidth={1.4-i*.18} opacity={1-i*.15}/>)}
    <circle cx="140" cy="278" r="40" fill="none" stroke="#aaa" strokeWidth=".8"/>
    <circle cx="140" cy="278" r="26" fill="none" stroke="#444" strokeWidth=".4"/>
    <path d="M120 278 Q140 256,160 278 Q140 300,120 278" fill="#666" opacity=".2"/>
  </svg>,
];

const works = [
  {id:1,title:"Quiet Gaze",   style:"Realism",   bg:"#161616"},
  {id:2,title:"Inner Form",   style:"Surrealism", bg:"#111"},
  {id:3,title:"Sacred Order", style:"Geometric",  bg:"#1a1a1a"},
  {id:4,title:"Botanical",    style:"Fine Line",  bg:"#131313"},
  {id:5,title:"The Figure",   style:"Realism",   bg:"#0f0f0f"},
  {id:6,title:"Fluid State",  style:"Surrealism", bg:"#181818"},
];

const styleCards = [
  {num:"01",title:"Realism",     body:"Portraits, animals, objects — rendered with photographic fidelity. Every shadow, every texture, every detail placed with surgical precision."},
  {num:"02",title:"Surrealism",  body:"Dream logic made permanent. The impossible rendered with the same precision as the real — melting, morphing compositions that feel inevitable on skin."},
  {num:"03",title:"Portraiture", body:"People, faces, presences — captured with emotional fidelity. A portrait tattoo should feel alive. That requires more than technical skill; it requires seeing."},
];

const processList = [
  {n:"01",title:"Consultation", body:"We meet — in person or remotely — and talk about your vision, your body, your story. No forms, no templates. This conversation is the foundation of the piece."},
  {n:"02",title:"Design",       body:"A custom composition developed exclusively for you. Scale, placement, and balance are all considered together — because a tattoo is part of your body's architecture."},
  {n:"03",title:"Execution",    body:"Unhurried, precise, focused entirely on your piece. One client at a time. What gets made here will never be tattooed on another person."},
];

const faqs = [
  {q:"What styles do you work in?",     a:"Primarily realism and surrealism — sometimes blended into the same piece. Hyper-realistic portraits, dreamlike anatomical compositions, and everything in between. No flash, no templates."},
  {q:"How long does a consultation take?", a:"45–60 minutes. We go deep into your concept, reference imagery, placement, and scale. No obligation, no rush."},
  {q:"Do you accept walk-ins?",         a:"No. Every session is booked in advance. Custom work requires time to design properly — walk-ins would compromise the quality of every piece."},
  {q:"How far ahead are you booking?",  a:"Currently 6–8 weeks out. Reach out early — popular time slots fill up first."},
  {q:"Do you travel for guest spots?",  a:"Yes, 6–8 times per year. Follow on Instagram to see upcoming dates, or get in touch to request a city."},
];

const testimonials = [
  {quote:"She spent two hours on the consultation alone. The result felt like she'd read my mind — and then improved it.",name:"Emilia R.",city:"Copenhagen"},
  {quote:"I've had work done in four countries. This is the only studio that's ever made me genuinely nervous — in the best possible way.",name:"Jonas T.",city:"Berlin"},
  {quote:"The surrealism piece still stops people cold. It looks impossible. That's exactly what I wanted.",name:"Petra L.",city:"Stockholm"},
];

function useCounter(target,dur=1800,active=false){
  const [v,setV]=useState(0);
  useEffect(()=>{
    if(!active)return;
    let s=null;
    const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1);setV(Math.floor(p*target));if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  },[active,target,dur]);
  return v;
}

function useVisible(ref){
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    if(!ref.current)return;
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:.25});
    o.observe(ref.current);
    return()=>o.disconnect();
  },[ref]);
  return vis;
}

export default function App(){
  const serif={fontFamily:"'Cormorant Garamond',serif"};
  const mono ={fontFamily:"'DM Mono',monospace"};

  const [slide,   setSlide]   = useState(0);
  const [heroFade,setHeroFade]= useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
  const [testIdx, setTestIdx] = useState(0);
  const [scrolled,setScrolled]= useState(false);
  const [form,    setForm]    = useState({name:"",email:"",style:"",date:"",message:""});
  const [sent,    setSent]    = useState(false);

  const statsRef = useRef(null);
  const statsVis = useVisible(statsRef);
  const c1 = useCounter(12,  1600, statsVis);
  const c2 = useCounter(500, 1800, statsVis);
  const c3 = useCounter(8,   1200, statsVis);

  /* hero auto-cycle */
  useEffect(()=>{
    const id=setInterval(()=>{
      setHeroFade(false);
      setTimeout(()=>{setSlide(s=>(s+1)%3);setHeroFade(true);},380);
    },5000);
    return()=>clearInterval(id);
  },[]);

  /* global styles + fonts */
  useEffect(()=>{
    const onS=()=>setScrolled(window.scrollY>30);
    window.addEventListener("scroll",onS);

    const lk=document.createElement("link");
    lk.rel="stylesheet";
    lk.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&display=swap";
    document.head.appendChild(lk);

    const st=document.createElement("style");
    st.textContent=`
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0e0e0e}::-webkit-scrollbar-thumb{background:#444}
.nl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#aaa;cursor:pointer;position:relative;padding-bottom:3px;transition:color .3s;background:none;border:none}
.nl::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#fff;transition:width .35s}
.nl:hover{color:#fff}.nl:hover::after{width:100%}
.btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;padding:13px 36px;background:transparent;border:1px solid #fff;color:#fff;cursor:pointer;transition:background .25s,color .25s}
.btn:hover{background:#fff;color:#0e0e0e}
.btn-sm{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;padding:10px 22px;background:transparent;border:1px solid #333;color:#aaa;cursor:pointer;transition:all .3s}
.btn-sm:hover{border-color:#fff;color:#fff}
.fi{background:transparent;border:none;border-bottom:1px solid #2e2e2e;color:#fff;font-family:'DM Mono',monospace;font-size:12px;padding:12px 0;width:100%;outline:none;transition:border-color .3s}
.fi:focus{border-color:#fff}.fi::placeholder{color:#444}
select.fi option{background:#111}textarea.fi{resize:vertical;min-height:88px}
.fl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#666;display:block;margin-bottom:4px;margin-top:22px}
.gi{position:relative;overflow:hidden;cursor:pointer}
.gi .ov{position:absolute;inset:0;background:rgba(0,0,0,.72);opacity:0;transition:opacity .4s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px}
.gi:hover .ov{opacity:1}
.gi .bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:#fff;transform:scaleX(0);transform-origin:left;transition:transform .45s}
.gi:hover .bar{transform:scaleX(1)}
.fc{border:1px solid #1e1e1e;transition:border-color .35s,background .35s}
.fc:hover{border-color:#333;background:#111}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .9s ease forwards}
.fu1{animation:fadeUp .9s .15s ease forwards;opacity:0}
.fu2{animation:fadeUp .9s .3s  ease forwards;opacity:0}
.fu3{animation:fadeUp .9s .45s ease forwards;opacity:0}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq{animation:marquee 28s linear infinite;white-space:nowrap;display:inline-block}
`;
    document.head.appendChild(st);
    return()=>{window.removeEventListener("scroll",onS);document.head.removeChild(lk);document.head.removeChild(st);};
  },[]);

  const scrollTo = id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  /* reusable section header */
  const SH=({label,title})=>(
    <div style={{textAlign:"center",marginBottom:64}}>
      <p style={{...mono,fontSize:9,letterSpacing:".32em",textTransform:"uppercase",color:"#666",marginBottom:14}}>{label}</p>
      <h2 style={{...serif,fontSize:"clamp(38px,5.5vw,72px)",fontWeight:300,letterSpacing:"-.01em",lineHeight:1}}>{title}</h2>
      <div style={{width:32,height:1,background:"#1e1e1e",margin:"20px auto 0"}}/>
    </div>
  );

  return(
    <div style={{background:BG,color:W,...serif,minHeight:"100vh"}}>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        padding:"0 52px",height:70,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:scrolled?"rgba(14,14,14,.97)":"transparent",
        borderBottom:scrolled?`1px solid ${BD}`:"none",
        backdropFilter:scrolled?"blur(10px)":"none",
        transition:"background .4s,border .4s",
      }}>
        <div style={{display:"flex",flexDirection:"column",lineHeight:1.1,cursor:"pointer"}} onClick={()=>scrollTo("home")}>
          <span style={{...serif,fontSize:16,fontWeight:300,letterSpacing:".35em",textTransform:"uppercase",color:W}}>Inksomna</span>
          <span style={{...mono,fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"#555",marginTop:2}}>Tattoo Art · Copenhagen</span>
        </div>
        {/* Nav links at #aaa — readable on dark bg */}
        <div style={{display:"flex",gap:36}}>
          {["Work","About","FAQ","Booking"].map(x=>(
            <button key={x} className="nl" onClick={()=>scrollTo(x.toLowerCase())}>{x}</button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"flex-end",padding:"0 52px 72px",background:BG3}}>
        <div style={{position:"absolute",right:"-1%",top:"50%",transform:"translateY(-50%)",...serif,fontSize:"clamp(200px,28vw,360px)",fontWeight:300,color:W,opacity:.03,lineHeight:1,pointerEvents:"none",userSelect:"none"}}>01</div>
        <div style={{position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",width:"38vw",height:"72vh",display:"flex",alignItems:"center",justifyContent:"center",opacity:heroFade?.5:0,transition:"opacity .5s",pointerEvents:"none"}}>
          {arts[slide%3]}
        </div>
        <div style={{position:"absolute",left:52,top:"15%",bottom:"15%",width:1,background:"linear-gradient(to bottom,transparent,#222,transparent)"}}/>
        <div style={{position:"relative",zIndex:2,maxWidth:820}}>
          <p className="fu" style={{...mono,fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#666",marginBottom:22}}>Realism · Surrealism · Copenhagen</p>
          <h1 className="fu1" style={{...serif,fontSize:"clamp(68px,11vw,150px)",fontWeight:300,lineHeight:.86,letterSpacing:"-.025em",color:W}}>Ink<em>somna</em></h1>
          <div className="fu2" style={{display:"flex",alignItems:"center",gap:20,margin:"34px 0 48px"}}>
            <div style={{height:1,width:40,background:"#222",flexShrink:0}}/>
            {/* hero tagline — #888 readable on #080808 */}
            <p style={{...mono,fontSize:11,lineHeight:1.95,color:"#888",maxWidth:380}}>Where the real and the dreamlike converge permanently on skin. Custom realism and surrealism — no templates, no repetition.</p>
          </div>
          <div className="fu3" style={{display:"flex",gap:18,alignItems:"center"}}>
            <button className="btn" onClick={()=>scrollTo("booking")}>Book a Session</button>
            <button className="nl" onClick={()=>scrollTo("work")}>See the Work ↓</button>
          </div>
        </div>
        <div style={{position:"absolute",bottom:34,right:52,display:"flex",gap:10,zIndex:5}}>
          {[0,1,2].map(i=>(
            <span key={i} onClick={()=>{setHeroFade(false);setTimeout(()=>{setSlide(i);setHeroFade(true);},320);}}
              style={{width:i===slide?20:5,height:5,borderRadius:3,background:i===slide?"#fff":"#2e2e2e",cursor:"pointer",transition:"width .35s,background .35s"}}/>
          ))}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:`linear-gradient(to bottom,transparent,${BG3})`,pointerEvents:"none"}}/>
      </section>

      {/* ── STYLE CARDS ── */}
      <section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",borderTop:`1px solid ${BD}`}}>
        {styleCards.map((s,i)=>(
          <div key={i} className="fc" style={{borderLeft:i>0?`1px solid ${BD}`:"none",padding:0}}>
            <div style={{height:240,background:[S1,"#0c0c0c","#131313"][i],position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {arts[i]}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:50,background:`linear-gradient(to bottom,transparent,${[S1,"#0c0c0c","#131313"][i]})`}}/>
            </div>
            <div style={{padding:"28px 30px 34px"}}>
              {/* card number — #666 readable */}
              <p style={{...mono,fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:"#666",marginBottom:10}}>{s.num}</p>
              <h3 style={{fontSize:26,fontWeight:300,marginBottom:14}}>{s.title}</h3>
              {/* card body — #999 clearly readable on dark */}
              <p style={{...mono,fontSize:11,lineHeight:1.9,color:"#999",marginBottom:22}}>{s.body}</p>
              <button className="btn-sm" onClick={()=>scrollTo("work")}>View Work</button>
            </div>
          </div>
        ))}
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="work" style={{padding:"100px 52px",background:BG2,borderTop:`1px solid ${BD}`}}>
        <SH label="Check out our" title="Art Showcase"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3}}>
          {works.map((w,i)=>(
            <div key={w.id} className="gi" style={{background:w.bg,height:i%3===1?410:340,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{arts[i%arts.length]}</div>
              <div className="ov">
                <p style={{...mono,fontSize:8,letterSpacing:".28em",textTransform:"uppercase",color:"#aaa"}}>{w.style}</p>
                <p style={{fontSize:20,fontWeight:300}}>{w.title}</p>
              </div>
              <div className="bar"/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"center",marginTop:52}}>
          <button className="btn">View Full Portfolio</button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{background:BG3,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
        {[[c1,"+","Years of Practice"],[c2,"+","Custom Pieces"],[c3,"","Guest Spots / yr"],["100","%","Custom Work"]].map(([n,s,l],i)=>(
          <div key={i} style={{padding:"56px 0",textAlign:"center",borderRight:i<3?`1px solid ${BD}`:"none"}}>
            <p style={{...serif,fontSize:"clamp(46px,6vw,84px)",fontWeight:300,color:W,lineHeight:1,letterSpacing:"-.02em"}}>{n}{s}</p>
            {/* stat labels — #555 readable */}
            <p style={{...mono,fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#555",marginTop:10}}>{l}</p>
          </div>
        ))}
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{padding:"100px 52px",background:BG,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <div style={{width:"100%",paddingBottom:"130%",background:S1,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:.3}}>{arts[0]}</div>
            <p style={{...mono,position:"absolute",bottom:20,left:0,right:0,textAlign:"center",fontSize:8,letterSpacing:".22em",textTransform:"uppercase",color:"#333"}}>Artist Photo</p>
          </div>
          <div style={{position:"absolute",top:-12,left:-12,right:12,bottom:12,border:`1px solid #1e1e1e`,zIndex:-1}}/>
        </div>
        <div>
          {/* about label — #666 */}
          <p style={{...mono,fontSize:9,letterSpacing:".32em",textTransform:"uppercase",color:"#666",marginBottom:18}}>About the Artist</p>
          <h2 style={{fontSize:"clamp(30px,4vw,54px)",fontWeight:300,lineHeight:1.06,marginBottom:10}}>Where the real becomes<br/><em>impossible.</em></h2>
          <div style={{width:28,height:1,background:"#222",margin:"22px 0"}}/>
          {/* about body — #999 */}
          <p style={{...mono,fontSize:11,lineHeight:2,color:"#999",marginBottom:18}}>Based in Copenhagen with over a decade of experience in realism and surrealism. Every piece begins not with a sketch, but with a conversation about what you want to feel when you look at your skin.</p>
          {/* secondary para — #777 */}
          <p style={{...mono,fontSize:11,lineHeight:2,color:"#777",marginBottom:48}}>The approach is slow and deliberate. One consultation. One design phase. One tattoo, made precisely for your body — never reproduced, never templated. If you want something unrepeatable, this is the right studio.</p>
          <button className="btn" onClick={()=>scrollTo("booking")}>Start a Conversation</button>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{borderTop:`1px solid ${BD}`,borderBottom:`1px solid ${BD}`,padding:"16px 0",overflow:"hidden",background:BG3}}>
        <div className="mq">
          {Array(4).fill(["REALISM","SURREALISM","PORTRAITURE","FINE LINE","BLACKWORK","CUSTOM ONLY","COPENHAGEN","INKSOMNA"]).flat().map((t,i)=>(
            <span key={i} style={{...mono,fontSize:10,letterSpacing:".32em",textTransform:"uppercase",color:i%2===0?"#2e2e2e":"#444",marginRight:48}}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── PROCESS ── */}
      <section style={{padding:"100px 52px",background:BG2,borderTop:`1px solid ${BD}`}}>
        <SH label="How it works" title="The Process"/>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          {processList.map((p,i)=>(
            <div key={i} style={{borderTop:`1px solid ${BD}`,padding:"36px 0",display:"flex",gap:32,alignItems:"flex-start"}}>
              <span style={{...serif,fontSize:52,fontWeight:300,color:"#1e1e1e",lineHeight:1,flexShrink:0,width:80}}>{p.n}</span>
              <div>
                <h4 style={{fontSize:22,fontWeight:300,marginBottom:10}}>{p.title}</h4>
                {/* process body — #999 */}
                <p style={{...mono,fontSize:11,lineHeight:1.9,color:"#999"}}>{p.body}</p>
              </div>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${BD}`}}/>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{padding:"88px 52px",background:BG3,borderTop:`1px solid ${BD}`,textAlign:"center"}}>
        <p style={{...mono,fontSize:9,letterSpacing:".32em",textTransform:"uppercase",color:"#666",marginBottom:14}}>Client Words</p>
        <div style={{maxWidth:700,margin:"0 auto",minHeight:150,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <p style={{...serif,fontSize:"clamp(22px,3vw,36px)",fontWeight:300,fontStyle:"italic",lineHeight:1.45,color:W,marginBottom:24}}>"{testimonials[testIdx].quote}"</p>
          {/* attribution — #666 */}
          <p style={{...mono,fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#666"}}>— {testimonials[testIdx].name}, {testimonials[testIdx].city}</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:34}}>
          {testimonials.map((_,i)=>(
            <span key={i} onClick={()=>setTestIdx(i)} style={{width:i===testIdx?20:5,height:5,borderRadius:3,background:i===testIdx?"#555":"#1e1e1e",cursor:"pointer",transition:"width .3s"}}/>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{padding:"100px 52px",background:BG,borderTop:`1px solid ${BD}`}}>
        <SH label="We are here for you" title="FAQ"/>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          {faqs.map((f,i)=>(
            <div key={i} style={{borderTop:`1px solid ${BD}`}}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"24px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:W}}>
                {/* FAQ question — #888 */}
                <span style={{...mono,fontSize:11,textAlign:"left",color:"#888"}}>{f.q}</span>
                <span style={{...mono,fontSize:16,color:faqOpen===i?"#aaa":"#444",transition:"transform .3s,color .3s",transform:faqOpen===i?"rotate(45deg)":"rotate(0)",flexShrink:0,marginLeft:20}}>+</span>
              </button>
              <div style={{maxHeight:faqOpen===i?180:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                {/* FAQ answer — #777 */}
                <p style={{...mono,fontSize:11,lineHeight:1.95,color:"#777",paddingBottom:22}}>{f.a}</p>
              </div>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${BD}`}}/>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" style={{padding:"100px 52px",background:BG3,borderTop:`1px solid ${BD}`}}>
        <SH label="We are here for you" title="Book Anytime"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:80,maxWidth:1060,margin:"0 auto"}}>
          {/* left col */}
          <div>
            {/* hours label — #666 */}
            <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#666",marginBottom:16}}>Opening Hours</p>
            {[["Monday – Friday","10:00 – 20:00"],["Saturday","10:00 – 16:00"],["Sunday","Closed"]].map(([d,t])=>(
              <div key={d} style={{padding:"12px 0",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between"}}>
                {/* day label — #777 */}
                <span style={{...mono,fontSize:11,color:"#777"}}>{d}</span>
                {/* time — #ccc when open, #444 when closed */}
                <span style={{...mono,fontSize:11,color:t==="Closed"?"#444":"#ccc"}}>{t}</span>
              </div>
            ))}
            <div style={{marginTop:32}}>
              <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#666",marginBottom:14}}>Studio</p>
              {/* address — #777 */}
              <p style={{...mono,fontSize:11,lineHeight:2,color:"#777"}}>Vesterbrogade 42<br/>1620 Copenhagen V<br/>Denmark</p>
            </div>
            <div style={{marginTop:24}}>
              <p style={{...mono,fontSize:11,lineHeight:2,color:"#777"}}>hello@inksomna.com</p>
              <p style={{...mono,fontSize:11,color:"#777"}}>+45 31 00 00 00</p>
            </div>
            <div style={{marginTop:36,padding:"18px 22px",border:`1px solid ${BD}`}}>
              <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#666",marginBottom:8}}>Currently booking</p>
              <p style={{...serif,fontSize:28,fontWeight:300,color:W}}>6–8 weeks out</p>
            </div>
          </div>
          {/* right col — form */}
          <div>
            {sent?(
              <div style={{paddingTop:72,textAlign:"center"}}>
                <div style={{width:36,height:1,background:"#1e1e1e",margin:"0 auto 24px"}}/>
                <h3 style={{fontSize:34,fontWeight:300,marginBottom:14}}>Thank you.</h3>
                <p style={{...mono,fontSize:11,color:"#777",lineHeight:1.9}}>Your message has been received.<br/>I'll be in touch within 48 hours.</p>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 40px"}}>
                <div><label className="fl">Full Name</label><input className="fi" type="text" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                <div><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                <div>
                  <label className="fl">Style Interest</label>
                  <select className="fi" value={form.style} onChange={e=>setForm({...form,style:e.target.value})}>
                    <option value="">Select a style</option>
                    {["Realism","Surrealism","Portrait","Fine Line Realism","Not sure yet"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="fl">Preferred Date</label><input className="fi" type="text" placeholder="Month / flexible" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
                <div style={{gridColumn:"1/-1"}}>
                  <label className="fl">Describe Your Vision</label>
                  <textarea className="fi" rows={5} placeholder="Subject, size, placement, mood, references — tell me everything..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
                </div>
                <div style={{gridColumn:"1/-1",paddingTop:24}}>
                  <button className="btn" onClick={()=>{if(form.name&&form.email)setSent(true);}}>Send Inquiry</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:`1px solid ${BD}`,background:BG3}}>
        <div style={{padding:"56px 52px",display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48}}>
          <div>
            <p style={{...serif,fontSize:18,fontWeight:300,letterSpacing:".35em",textTransform:"uppercase",color:W,marginBottom:14}}>Inksomna</p>
            {/* footer desc — #555 (subtle, it's a footer) */}
            <p style={{...mono,fontSize:11,lineHeight:1.9,color:"#555",maxWidth:280}}>Custom realism and surrealism tattoo artistry in Copenhagen. One artist. One client at a time.</p>
            <div style={{display:"flex",gap:14,marginTop:28}}>
              <button className="btn-sm">Instagram</button>
              <button className="btn-sm">Email</button>
            </div>
          </div>
          <div>
            {/* footer nav heading — #444 */}
            <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#444",marginBottom:18}}>Navigation</p>
            {["Work","About","FAQ","Booking"].map(x=>(
              <p key={x} style={{marginBottom:10}}>
                <button className="nl" onClick={()=>scrollTo(x.toLowerCase())}>{x}</button>
              </p>
            ))}
          </div>
          <div>
            <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#444",marginBottom:18}}>Studio</p>
            <p style={{...mono,fontSize:11,lineHeight:2,color:"#555"}}>Vesterbrogade 42<br/>1620 Copenhagen V<br/>Denmark</p>
          </div>
        </div>
        <div style={{padding:"18px 52px",borderTop:"1px solid #141414",display:"flex",justifyContent:"space-between"}}>
          <p style={{...mono,fontSize:9,color:"#2a2a2a"}}>© 2026 Inksomna · Copenhagen</p>
          <p style={{...mono,fontSize:9,color:"#2a2a2a"}}>inksomna.com</p>
        </div>
      </footer>

    </div>
  );
}
