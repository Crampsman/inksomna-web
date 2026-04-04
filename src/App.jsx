import { useState, useEffect, useRef } from "react";

const BG  = "#0e0e0e";
const BG2 = "#0a0a0a";
const BG3 = "#080808";
const S1  = "#111111";
const BD  = "#1a1a1a";
const W   = "#ffffff";

/* ── Change this to the real Instagram handle ── */
const IG_HANDLE  = "@inksomna";
const IG_URL     = "https://instagram.com/inksomna";

const arts = [
  <svg key={0} viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.5}}>
    <ellipse cx="200" cy="200" rx="130" ry="170" fill="none" stroke="#fff" strokeWidth=".8"/>
    <ellipse cx="200" cy="200" rx="95" ry="130" fill="none" stroke="#444" strokeWidth=".4"/>
    <ellipse cx="200" cy="200" rx="58" ry="80" fill="none" stroke="#fff" strokeWidth=".6"/>
    <circle cx="200" cy="200" r="22" fill="none" stroke="#fff" strokeWidth="1.2"/>
    <circle cx="200" cy="200" r="7" fill="#fff" opacity=".6"/>
    <line x1="200" y1="30" x2="200" y2="70" stroke="#333" strokeWidth=".5"/>
    <line x1="200" y1="330" x2="200" y2="370" stroke="#333" strokeWidth=".5"/>
    <path d="M200 370 C200 370,195 400,198 430 C201 460,200 490,200 500" fill="none" stroke="#fff" strokeWidth=".8" strokeLinecap="round"/>
    <circle cx="198" cy="432" r="4" fill="none" stroke="#fff" strokeWidth=".6"/>
  </svg>,
  <svg key={1} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.5}}>
    <ellipse cx="140" cy="160" rx="80" ry="110" fill="none" stroke="#fff" strokeWidth=".7"/>
    <ellipse cx="140" cy="120" rx="44" ry="56" fill="none" stroke="#aaa" strokeWidth=".5"/>
    <circle cx="126" cy="112" r="10" fill="none" stroke="#ccc" strokeWidth=".8"/>
    <circle cx="154" cy="112" r="10" fill="none" stroke="#ccc" strokeWidth=".8"/>
    <circle cx="126" cy="112" r="4" fill="#888"/>
    <circle cx="154" cy="112" r="4" fill="#888"/>
    <path d="M130 136 Q140 148 150 136" fill="none" stroke="#ccc" strokeWidth=".8"/>
  </svg>,
  <svg key={2} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.55}}>
    <circle cx="140" cy="140" r="88" fill="none" stroke="#444" strokeWidth=".4"/>
    <circle cx="140" cy="140" r="62" fill="none" stroke="#fff" strokeWidth=".7"/>
    <polygon points="140,55 215,200 65,200" fill="none" stroke="#fff" strokeWidth="1.2"/>
    <polygon points="140,225 65,80 215,80" fill="none" stroke="#fff" strokeWidth="1.2"/>
    <circle cx="140" cy="140" r="14" fill="none" stroke="#fff" strokeWidth=".8"/>
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
    <circle cx="140" cy="110" r="16" fill="none" stroke="#ccc" strokeWidth=".7"/>
    <circle cx="140" cy="110" r="6" fill="#777" opacity=".6"/>
  </svg>,
  <svg key={5} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",opacity:.48}}>
    {[0,1,2,3,4].map(i=><path key={i} d={`M40 ${110+i*32} Q80 ${82+i*32},140 ${110+i*32} Q200 ${138+i*32},240 ${110+i*32}`} fill="none" stroke="#aaa" strokeWidth={1.4-i*.18} opacity={1-i*.15}/>)}
    <circle cx="140" cy="278" r="40" fill="none" stroke="#aaa" strokeWidth=".8"/>
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
  {num:"01",title:"Realism",     body:"Portraits, animals, objects — rendered with photographic fidelity. Every shadow, every texture placed with surgical precision."},
  {num:"02",title:"Surrealism",  body:"Dream logic made permanent. The impossible rendered with the same care as the real — melting, morphing compositions that feel inevitable."},
  {num:"03",title:"Portraiture", body:"People, faces, presences — captured with emotional fidelity. A portrait should feel alive. That requires more than skill; it requires seeing."},
];

const processList = [
  {n:"01",title:"Consultation", body:"We meet — in person or remotely — and talk about your vision, your body, your story. No forms, no templates."},
  {n:"02",title:"Design",       body:"A custom composition developed exclusively for you. Scale, placement, and balance considered as a whole."},
  {n:"03",title:"Execution",    body:"Unhurried, precise, focused entirely on your piece. One client at a time. Never reproduced on another person."},
];

const faqs = [
  {q:"What styles do you work in?",       a:"Primarily realism and surrealism — sometimes blended. Hyper-realistic portraits, dreamlike anatomical compositions. No flash, no templates."},
  {q:"How long does a consultation take?", a:"45–60 minutes. We go deep into your concept, reference imagery, placement, and scale. No obligation, no rush."},
  {q:"Do you accept walk-ins?",           a:"No. Every session is booked in advance. Custom work requires time to design properly."},
  {q:"How far ahead are you booking?",    a:"Currently 6–8 weeks out. Reach out early — popular time slots fill up first."},
  {q:"Do you travel for guest spots?",    a:"Yes, 6–8 times per year. Follow on Instagram to see upcoming dates."},
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
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:.2});
    o.observe(ref.current);
    return()=>o.disconnect();
  },[ref]);
  return vis;
}

export default function Inksomna(){
  const serif={fontFamily:"'Cormorant Garamond',serif"};
  const mono ={fontFamily:"'DM Mono',monospace"};

  const [slide,    setSlide]   = useState(0);
  const [heroFade, setHeroFade]= useState(true);
  const [faqOpen,  setFaqOpen] = useState(null);
  const [testIdx,  setTestIdx] = useState(0);
  const [scrolled, setScrolled]= useState(false);
  const [menuOpen, setMenuOpen]= useState(false);
  const [igOpen,   setIgOpen]  = useState(false);
  const [form,     setForm]    = useState({name:"",email:"",message:""});
  const [sent,     setSent]    = useState(false);

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

  /* close IG overlay on Escape */
  useEffect(()=>{
    const fn=e=>{if(e.key==="Escape")setIgOpen(false);};
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[]);

  /* global styles */
  useEffect(()=>{
    const onS=()=>setScrolled(window.scrollY>30);
    window.addEventListener("scroll",onS);

    const lk=document.createElement("link");
    lk.rel="stylesheet";
    lk.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&display=swap";
    document.head.appendChild(lk);

    const st=document.createElement("style");
    st.textContent=`
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0e0e0e}::-webkit-scrollbar-thumb{background:#444}

.nl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#aaa;cursor:pointer;position:relative;padding-bottom:3px;transition:color .3s;background:none;border:none}
.nl::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#fff;transition:width .35s}
.nl:hover{color:#fff}.nl:hover::after{width:100%}

.btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;padding:13px 36px;background:transparent;border:1px solid #fff;color:#fff;cursor:pointer;transition:background .25s,color .25s;white-space:nowrap}
.btn:hover{background:#fff;color:#0e0e0e}
.btn-sm{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;padding:10px 22px;background:transparent;border:1px solid #333;color:#aaa;cursor:pointer;transition:all .3s}
.btn-sm:hover{border-color:#fff;color:#fff}

.fi{background:transparent;border:none;border-bottom:1px solid #2e2e2e;color:#fff;font-family:'DM Mono',monospace;font-size:12px;padding:12px 0;width:100%;outline:none;transition:border-color .3s}
.fi:focus{border-color:#fff}.fi::placeholder{color:#444}
textarea.fi{resize:vertical;min-height:120px}
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
.fu2{animation:fadeUp .9s .3s ease forwards;opacity:0}
.fu3{animation:fadeUp .9s .45s ease forwards;opacity:0}

@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq{animation:marquee 28s linear infinite;white-space:nowrap;display:inline-block}

/* ── MOBILE MENU ── */
.mob-menu{position:fixed;inset:0;background:#080808;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;transform:translateX(100%);transition:transform .4s cubic-bezier(.25,.46,.45,.94)}
.mob-menu.open{transform:translateX(0)}

/* ── INSTAGRAM BUTTON ── */
.ig-btn{position:fixed;bottom:28px;right:28px;z-index:150;width:48px;height:48px;border-radius:50%;background:#0e0e0e;border:1px solid #333;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .3s,transform .3s}
.ig-btn:hover{border-color:#fff;transform:scale(1.08)}
.ig-btn::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(255,255,255,.1);animation:igpulse 2.5s ease-in-out infinite}
@keyframes igpulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:0}}

/* ── INSTAGRAM OVERLAY ── */
.ig-ov{position:fixed;inset:0;z-index:400;background:#080808;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .5s cubic-bezier(.25,.46,.45,.94)}
.ig-ov.open{opacity:1;pointer-events:all}
.ig-frame{position:absolute;inset:32px;border:1px solid #1a1a1a;pointer-events:none}
.ig-handle{font-size:clamp(44px,9vw,96px);font-weight:300;font-style:italic;line-height:.9;letter-spacing:-.02em;margin-bottom:28px;opacity:0;transform:translateY(20px);transition:opacity .6s .2s,transform .6s .2s}
.ig-ov.open .ig-handle{opacity:1;transform:translateY(0)}
.ig-desc{font-family:'DM Mono',monospace;font-size:11px;line-height:1.95;color:#666;max-width:320px;margin:0 auto 40px;text-align:center;opacity:0;transform:translateY(14px);transition:opacity .6s .35s,transform .6s .35s}
.ig-ov.open .ig-desc{opacity:1;transform:translateY(0)}
.ig-cta{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;padding:13px 44px;background:transparent;border:1px solid #fff;color:#fff;cursor:pointer;text-decoration:none;display:inline-block;opacity:0;transition:background .25s,color .25s,opacity .6s .5s}
.ig-ov.open .ig-cta{opacity:1}
.ig-cta:hover{background:#fff;color:#080808}
.ig-stats{position:absolute;bottom:52px;left:0;right:0;display:flex;justify-content:center;gap:64px;opacity:0;transition:opacity .6s .6s}
.ig-ov.open .ig-stats{opacity:1}
.ig-close-btn{position:absolute;top:44px;right:48px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#444;cursor:pointer;background:none;border:none;transition:color .3s}
.ig-close-btn:hover{color:#fff}

/* corner marks */
.c-mark{position:absolute;width:14px;height:14px}
.c-mark::before,.c-mark::after{content:'';position:absolute;background:#2a2a2a}
.c-mark::before{width:100%;height:1px}
.c-mark::after{width:1px;height:100%}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .hero-art{display:none!important}
  .style-grid{grid-template-columns:1fr!important}
  .style-grid .fc{border-left:1px solid #1e1e1e!important;border-top:1px solid #1e1e1e}
  .about-grid{grid-template-columns:1fr!important}
  .about-img{display:none!important}
  .booking-grid{grid-template-columns:1fr!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .footer-grid{grid-template-columns:1fr 1fr!important}
  .ig-stats{gap:36px!important;bottom:36px!important}
  .ig-frame{inset:16px!important}
  .ig-close-btn{top:28px!important;right:28px!important}
}

@media(max-width:600px){
  .nav-links{display:none!important}
  .hamburger{display:flex!important}
  .section-pad{padding:56px 20px!important}
  .hero-pad{padding:0 20px 52px!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .port-grid{grid-template-columns:1fr 1fr!important}
  .port-grid .gi{height:160px!important}
  .form-grid{grid-template-columns:1fr!important}
  .footer-grid{grid-template-columns:1fr!important}
  .process-step{gap:14px!important}
  .process-num{font-size:32px!important;width:44px!important}
  .booking-info{display:none!important}
  .ig-btn{bottom:20px;right:20px;width:42px;height:42px}
  .ig-stats{display:none!important}
}
`;
    document.head.appendChild(st);
    return()=>{window.removeEventListener("scroll",onS);document.head.removeChild(lk);document.head.removeChild(st);};
  },[]);

  const scrollTo=id=>{
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMenuOpen(false);
  };

  const SH=({label,title})=>(
      <div style={{textAlign:"center",marginBottom:56}}>
        <p style={{...mono,fontSize:9,letterSpacing:".32em",textTransform:"uppercase",color:"#666",marginBottom:14}}>{label}</p>
        <h2 style={{...serif,fontSize:"clamp(32px,5vw,64px)",fontWeight:300,letterSpacing:"-.01em",lineHeight:1}}>{title}</h2>
        <div style={{width:32,height:1,background:"#1e1e1e",margin:"18px auto 0"}}/>
      </div>
  );

  return(
      <div style={{background:BG,color:W,...serif,minHeight:"100vh",overflowX:"hidden"}}>

        {/* ── MOBILE MENU ── */}
        <div className={`mob-menu${menuOpen?" open":""}`}>
          <button onClick={()=>setMenuOpen(false)} style={{position:"absolute",top:24,right:24,background:"none",border:"none",color:W,fontSize:28,cursor:"pointer",lineHeight:1}}>×</button>
          {["Work","About","FAQ","Booking"].map(x=>(
              <button key={x} className="nl" onClick={()=>scrollTo(x.toLowerCase())} style={{fontSize:18,letterSpacing:".2em"}}>{x}</button>
          ))}
          <button className="nl" onClick={()=>{setMenuOpen(false);setIgOpen(true);}} style={{fontSize:18,letterSpacing:".2em"}}>Instagram</button>
        </div>

        {/* ── NAV ── */}
        <nav style={{
          position:"fixed",top:0,left:0,right:0,zIndex:200,
          padding:"0 24px",height:64,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:scrolled?"rgba(14,14,14,.97)":"transparent",
          borderBottom:scrolled?`1px solid ${BD}`:"none",
          backdropFilter:scrolled?"blur(10px)":"none",
          transition:"background .4s,border .4s",
        }}>
          <div style={{display:"flex",flexDirection:"column",lineHeight:1.1,cursor:"pointer"}} onClick={()=>scrollTo("home")}>
            <span style={{...serif,fontSize:15,fontWeight:300,letterSpacing:".3em",textTransform:"uppercase",color:W}}>Inksomna</span>
            <span style={{...mono,fontSize:7,letterSpacing:".2em",textTransform:"uppercase",color:"#555",marginTop:2}}>Tattoo Art · Copenhagen</span>
          </div>
          <div className="nav-links" style={{display:"flex",gap:32,alignItems:"center"}}>
            {["Work","About","FAQ","Booking"].map(x=>(
                <button key={x} className="nl" onClick={()=>scrollTo(x.toLowerCase())}>{x}</button>
            ))}
            {/* Instagram icon in nav */}
            <button onClick={()=>setIgOpen(true)} style={{background:"none",border:"1px solid #2a2a2a",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"border-color .3s",marginLeft:8}} onMouseEnter={e=>e.currentTarget.style.borderColor="#fff"} onMouseLeave={e=>e.currentTarget.style.borderColor="#2a2a2a"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4.5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="#aaa" stroke="none"/>
              </svg>
            </button>
          </div>
          <button className="hamburger" onClick={()=>setMenuOpen(true)} style={{display:"none",flexDirection:"column",gap:5,background:"none",border:"none",cursor:"pointer",padding:4}}>
            <span style={{display:"block",width:24,height:1.5,background:W}}/>
            <span style={{display:"block",width:24,height:1.5,background:W}}/>
            <span style={{display:"block",width:18,height:1.5,background:W}}/>
          </button>
        </nav>

        {/* ── HERO ── */}
        <section id="home" style={{position:"relative",height:"100vh",minHeight:560,overflow:"hidden",display:"flex",alignItems:"flex-end",background:BG3}}>
          <div className="hero-art" style={{position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",width:"38vw",height:"72vh",display:"flex",alignItems:"center",justifyContent:"center",opacity:heroFade?.5:0,transition:"opacity .5s",pointerEvents:"none"}}>
            {arts[slide%3]}
          </div>
          <div style={{position:"relative",zIndex:2,padding:"0 24px 56px",maxWidth:820}} className="hero-pad">
            <p className="fu" style={{...mono,fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#666",marginBottom:20}}>Realism · Surrealism · Copenhagen</p>
            <h1 className="fu1" style={{...serif,fontSize:"clamp(52px,10vw,148px)",fontWeight:300,lineHeight:.88,letterSpacing:"-.025em",color:W}}>Ink<em>somna</em></h1>
            <div className="fu2" style={{display:"flex",alignItems:"flex-start",gap:16,margin:"28px 0 40px"}}>
              <div style={{height:1,width:30,background:"#222",flexShrink:0,marginTop:9}}/>
              <p style={{...mono,fontSize:11,lineHeight:1.95,color:"#888",maxWidth:340}}>Where the real and the dreamlike converge permanently on skin. Custom realism and surrealism — no templates, no repetition.</p>
            </div>
            <div className="fu3" style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
              <button className="btn" onClick={()=>scrollTo("booking")}>Book a Session</button>
              <button className="nl" onClick={()=>scrollTo("work")} style={{color:"#666"}}>See the Work ↓</button>
            </div>
          </div>
          <div style={{position:"absolute",bottom:28,right:24,display:"flex",gap:8,zIndex:5}}>
            {[0,1,2].map(i=>(
                <span key={i} onClick={()=>{setHeroFade(false);setTimeout(()=>{setSlide(i);setHeroFade(true);},320);}}
                      style={{width:i===slide?18:5,height:5,borderRadius:3,background:i===slide?"#fff":"#2e2e2e",cursor:"pointer",transition:"width .35s,background .35s"}}/>
            ))}
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:`linear-gradient(to bottom,transparent,${BG3})`,pointerEvents:"none"}}/>
        </section>

        {/* ── STYLE CARDS ── */}
        <section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",borderTop:`1px solid ${BD}`}} className="style-grid">
          {styleCards.map((s,i)=>(
              <div key={i} className="fc" style={{borderLeft:i>0?`1px solid ${BD}`:"none",padding:0}}>
                <div style={{height:200,background:[S1,"#0c0c0c","#131313"][i],position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {arts[i]}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:40,background:`linear-gradient(to bottom,transparent,${[S1,"#0c0c0c","#131313"][i]})`}}/>
                </div>
                <div style={{padding:"24px 24px 30px"}}>
                  <p style={{...mono,fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:"#666",marginBottom:8}}>{s.num}</p>
                  <h3 style={{fontSize:"clamp(20px,2.5vw,26px)",fontWeight:300,marginBottom:12}}>{s.title}</h3>
                  <p style={{...mono,fontSize:11,lineHeight:1.85,color:"#999",marginBottom:20}}>{s.body}</p>
                  <button className="btn-sm" onClick={()=>scrollTo("work")}>View Work</button>
                </div>
              </div>
          ))}
        </section>

        {/* ── PORTFOLIO ── */}
        <section id="work" style={{padding:"80px 24px",background:BG2,borderTop:`1px solid ${BD}`}} className="section-pad">
          <SH label="Check out our" title="Art Showcase"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3}} className="port-grid">
            {works.map((w,i)=>(
                <div key={w.id} className="gi" style={{background:w.bg,height:i%3===1?360:280,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{arts[i%arts.length]}</div>
                  <div className="ov">
                    <p style={{...mono,fontSize:8,letterSpacing:".28em",textTransform:"uppercase",color:"#aaa"}}>{w.style}</p>
                    <p style={{fontSize:18,fontWeight:300}}>{w.title}</p>
                  </div>
                  <div className="bar"/>
                </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"center",marginTop:44}}>
            <button className="btn">View Full Portfolio</button>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef} style={{background:BG3,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)"}} className="stats-grid">
          {[[c1,"+","Years"],[c2,"+","Pieces"],[c3,"","Guest Spots"],["100","%","Custom"]].map(([n,s,l],i)=>(
              <div key={i} style={{padding:"44px 0",textAlign:"center",borderRight:i<3?`1px solid ${BD}`:"none"}}>
                <p style={{...serif,fontSize:"clamp(38px,5vw,80px)",fontWeight:300,color:W,lineHeight:1,letterSpacing:"-.02em"}}>{n}{s}</p>
                <p style={{...mono,fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"#555",marginTop:8}}>{l}</p>
              </div>
          ))}
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{padding:"80px 24px",background:BG,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}} className="section-pad about-grid">
          <div className="about-img" style={{position:"relative"}}>
            <div style={{width:"100%",paddingBottom:"128%",background:S1,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:.3}}>{arts[0]}</div>
              <p style={{...mono,position:"absolute",bottom:16,left:0,right:0,textAlign:"center",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"#333"}}>Artist Photo</p>
            </div>
            <div style={{position:"absolute",top:-10,left:-10,right:10,bottom:10,border:`1px solid #1e1e1e`,zIndex:-1}}/>
          </div>
          <div>
            <p style={{...mono,fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#666",marginBottom:16}}>About the Artist</p>
            <h2 style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:300,lineHeight:1.08,marginBottom:8}}>Where the real becomes<br/><em>impossible.</em></h2>
            <div style={{width:26,height:1,background:"#222",margin:"20px 0"}}/>
            <p style={{...mono,fontSize:11,lineHeight:2,color:"#999",marginBottom:16}}>Based in Copenhagen with over a decade of experience in realism and surrealism. Every piece begins with a conversation about what you want to feel when you look at your skin.</p>
            <p style={{...mono,fontSize:11,lineHeight:2,color:"#777",marginBottom:40}}>One consultation. One design. One tattoo made precisely for your body — never reproduced, never templated.</p>
            <button className="btn" onClick={()=>scrollTo("booking")}>Start a Conversation</button>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{borderTop:`1px solid ${BD}`,borderBottom:`1px solid ${BD}`,padding:"14px 0",overflow:"hidden",background:BG3}}>
          <div className="mq">
            {Array(4).fill(["REALISM","SURREALISM","PORTRAITURE","FINE LINE","BLACKWORK","CUSTOM ONLY","COPENHAGEN","INKSOMNA"]).flat().map((t,i)=>(
                <span key={i} style={{...mono,fontSize:10,letterSpacing:".28em",textTransform:"uppercase",color:i%2===0?"#2e2e2e":"#444",marginRight:44}}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── PROCESS ── */}
        <section style={{padding:"80px 24px",background:BG2,borderTop:`1px solid ${BD}`}} className="section-pad">
          <SH label="How it works" title="The Process"/>
          <div style={{maxWidth:760,margin:"0 auto"}}>
            {processList.map((p,i)=>(
                <div key={i} style={{borderTop:`1px solid ${BD}`,padding:"28px 0",display:"flex",gap:24,alignItems:"flex-start"}} className="process-step">
                  <span style={{...serif,fontSize:48,fontWeight:300,color:"#1e1e1e",lineHeight:1,flexShrink:0,width:72}} className="process-num">{p.n}</span>
                  <div>
                    <h4 style={{fontSize:"clamp(18px,2.5vw,22px)",fontWeight:300,marginBottom:10}}>{p.title}</h4>
                    <p style={{...mono,fontSize:11,lineHeight:1.9,color:"#999"}}>{p.body}</p>
                  </div>
                </div>
            ))}
            <div style={{borderTop:`1px solid ${BD}`}}/>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{padding:"72px 24px",background:BG3,borderTop:`1px solid ${BD}`,textAlign:"center"}} className="section-pad">
          <p style={{...mono,fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#666",marginBottom:14}}>Client Words</p>
          <div style={{maxWidth:640,margin:"0 auto",minHeight:130,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <p style={{...serif,fontSize:"clamp(18px,3vw,34px)",fontWeight:300,fontStyle:"italic",lineHeight:1.5,color:W,marginBottom:22}}>"{testimonials[testIdx].quote}"</p>
            <p style={{...mono,fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"#666"}}>— {testimonials[testIdx].name}, {testimonials[testIdx].city}</p>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:30}}>
            {testimonials.map((_,i)=>(
                <span key={i} onClick={()=>setTestIdx(i)} style={{width:i===testIdx?18:5,height:5,borderRadius:3,background:i===testIdx?"#555":"#1e1e1e",cursor:"pointer",transition:"width .3s"}}/>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{padding:"80px 24px",background:BG,borderTop:`1px solid ${BD}`}} className="section-pad">
          <SH label="We are here for you" title="FAQ"/>
          <div style={{maxWidth:720,margin:"0 auto"}}>
            {faqs.map((f,i)=>(
                <div key={i} style={{borderTop:`1px solid ${BD}`}}>
                  <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:W,textAlign:"left"}}>
                    <span style={{...mono,fontSize:11,color:"#888",paddingRight:16}}>{f.q}</span>
                    <span style={{...mono,fontSize:16,color:faqOpen===i?"#aaa":"#444",transition:"transform .3s,color .3s",transform:faqOpen===i?"rotate(45deg)":"rotate(0)",flexShrink:0}}>+</span>
                  </button>
                  <div style={{maxHeight:faqOpen===i?200:0,overflow:"hidden",transition:"max-height .4s ease"}}>
                    <p style={{...mono,fontSize:11,lineHeight:1.9,color:"#777",paddingBottom:20}}>{f.a}</p>
                  </div>
                </div>
            ))}
            <div style={{borderTop:`1px solid ${BD}`}}/>
          </div>
        </section>

        {/* ── BOOKING ── */}
        <section id="booking" style={{padding:"80px 24px",background:BG3,borderTop:`1px solid ${BD}`}} className="section-pad">
          <SH label="We are here for you" title="Book Anytime"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:72,maxWidth:980,margin:"0 auto"}} className="booking-grid">
            <div className="booking-info">
              <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#666",marginBottom:16}}>Opening Hours</p>
              {[["Monday – Friday","10:00 – 20:00"],["Saturday","10:00 – 16:00"],["Sunday","Closed"]].map(([d,t])=>(
                  <div key={d} style={{padding:"11px 0",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between"}}>
                    <span style={{...mono,fontSize:11,color:"#777"}}>{d}</span>
                    <span style={{...mono,fontSize:11,color:t==="Closed"?"#444":"#ccc"}}>{t}</span>
                  </div>
              ))}
              <div style={{marginTop:28}}>
                <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#666",marginBottom:12}}>Studio</p>
                <p style={{...mono,fontSize:11,lineHeight:2,color:"#777"}}>Vesterbrogade 42<br/>1620 Copenhagen V<br/>Denmark</p>
              </div>
              <div style={{marginTop:20}}>
                <p style={{...mono,fontSize:11,lineHeight:2,color:"#777"}}>hello@inksomna.com</p>
                <p style={{...mono,fontSize:11,color:"#777"}}>+45 31 00 00 00</p>
              </div>
              <div style={{marginTop:32,padding:"16px 20px",border:`1px solid ${BD}`}}>
                <p style={{...mono,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"#666",marginBottom:6}}>Currently booking</p>
                <p style={{...serif,fontSize:26,fontWeight:300,color:W}}>6–8 weeks out</p>
              </div>
            </div>
            <div>
              {sent?(
                  <div style={{paddingTop:40,textAlign:"center"}}>
                    <div style={{width:32,height:1,background:"#1e1e1e",margin:"0 auto 22px"}}/>
                    <h3 style={{fontSize:30,fontWeight:300,marginBottom:12}}>Thank you.</h3>
                    <p style={{...mono,fontSize:11,color:"#777",lineHeight:1.9}}>Your message has been received.<br/>I'll be in touch within 48 hours.</p>
                  </div>
              ):(
                  <>
                    <p style={{...mono,fontSize:11,lineHeight:1.95,color:"#777",marginBottom:6}}>Tell me about your idea — what you want, where you want it, how it should feel. I'll get back to you within 48 hours.</p>
                    <p style={{...mono,fontSize:11,color:"#444",marginBottom:4}}>hello@inksomna.com · +45 31 00 00 00</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}} className="form-grid">
                      <div><label className="fl">Name</label><input className="fi" type="text" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                      <div><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                      <div style={{gridColumn:"1/-1"}}>
                        <label className="fl">Your Vision</label>
                        <textarea className="fi" placeholder="Subject, size, placement, mood, references — tell me everything..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
                      </div>
                      <div style={{gridColumn:"1/-1",paddingTop:24}}>
                        <button className="btn" onClick={()=>{if(form.name&&form.email)setSent(true);}}>Send Message</button>
                      </div>
                    </div>
                  </>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:`1px solid ${BD}`,background:BG3}}>
          <div style={{padding:"44px 24px",display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:32}} className="footer-grid">
            <div>
              <p style={{...serif,fontSize:16,fontWeight:300,letterSpacing:".3em",textTransform:"uppercase",color:W,marginBottom:12}}>Inksomna</p>
              <p style={{...mono,fontSize:11,lineHeight:1.9,color:"#444",maxWidth:260}}>Custom realism and surrealism in Copenhagen. One artist. One client at a time.</p>
              <div style={{display:"flex",gap:12,marginTop:22}}>
                <button className="btn-sm" onClick={()=>setIgOpen(true)}>Instagram</button>
                <button className="btn-sm" onClick={()=>scrollTo("booking")}>Email</button>
              </div>
            </div>
            <div>
              <p style={{...mono,fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#333",marginBottom:16}}>Navigation</p>
              {["Work","About","FAQ","Booking"].map(x=>(
                  <p key={x} style={{marginBottom:10}}><button className="nl" onClick={()=>scrollTo(x.toLowerCase())} style={{color:"#444"}}>{x}</button></p>
              ))}
            </div>
            <div>
              <p style={{...mono,fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#333",marginBottom:16}}>Studio</p>
              <p style={{...mono,fontSize:11,lineHeight:2,color:"#444"}}>Vesterbrogade 42<br/>Copenhagen V<br/>Denmark</p>
            </div>
          </div>
          <div style={{padding:"16px 24px",borderTop:"1px solid #141414",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <p style={{...mono,fontSize:9,color:"#2a2a2a"}}>© 2026 Inksomna · Copenhagen</p>
            <p style={{...mono,fontSize:9,color:"#2a2a2a"}}>inksomna.com</p>
          </div>
        </footer>

        {/* ── FLOATING INSTAGRAM BUTTON ── */}
        <div className="ig-btn" onClick={()=>setIgOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4.5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="#aaa" stroke="none"/>
          </svg>
        </div>

        {/* ── INSTAGRAM OVERLAY ── */}
        <div className={`ig-ov${igOpen?" open":""}`} onClick={e=>{if(e.target===e.currentTarget)setIgOpen(false);}}>
          <div className="ig-frame"/>

          {/* Corner marks */}
          <div className="c-mark" style={{position:"absolute",top:44,left:44}}/>
          <div className="c-mark" style={{position:"absolute",top:44,right:44,transform:"scaleX(-1)"}}/>
          <div className="c-mark" style={{position:"absolute",bottom:44,left:44,transform:"scaleY(-1)"}}/>
          <div className="c-mark" style={{position:"absolute",bottom:44,right:44,transform:"scale(-1)"}}/>

          <button className="ig-close-btn" onClick={()=>setIgOpen(false)}>Close ×</button>

          <div style={{textAlign:"center",padding:"0 32px"}}>
            <p style={{...mono,fontSize:9,letterSpacing:".36em",textTransform:"uppercase",color:"#444",marginBottom:24}}>Follow the Work</p>
            <p className="ig-handle" style={{...serif}}>{IG_HANDLE}</p>
            <div style={{width:1,height:36,background:"linear-gradient(to bottom,transparent,#2a2a2a,transparent)",margin:"0 auto 28px"}}/>
            <p className="ig-desc">Work in progress, healed pieces, flash availability, and guest spot announcements. Updated regularly.</p>
            <a className="ig-cta" href={IG_URL} target="_blank" rel="noreferrer">Open Instagram</a>
          </div>

          <div className="ig-stats">
            {[["12k","Followers"],["500+","Posts"],["Daily","Updates"]].map(([n,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <p style={{...serif,fontSize:28,fontWeight:300,color:W,lineHeight:1}}>{n}</p>
                  <p style={{...mono,fontSize:8,letterSpacing:".22em",textTransform:"uppercase",color:"#3a3a3a",marginTop:6}}>{l}</p>
                </div>
            ))}
          </div>
        </div>

      </div>
  );
}
