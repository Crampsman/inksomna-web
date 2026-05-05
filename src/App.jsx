import {useState, useEffect, useRef, useCallback} from "react";

const BG = "#0e0e0e";
const BG2 = "#0a0a0a";
const BG3 = "#080808";
const S1 = "#111111";
const BD = "#1a1a1a";
const W = "#ffffff";

const IG_HANDLE = "@inksomna";
const IG_URL = "https://instagram.com/inksomna";
const CITY = "Wrocław";
const ARTIST_PHOTO = "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775419027/20251122082238_IMG_2024_afwylk.jpg"; // ← paste your Cloudinary URL here

/* ── Cloudinary image optimizer ─────────────────────────────────
   Automatically adds width + quality + format params to any URL.
   w=1600  for hero slides (full screen)
   w=1200  for gallery lightbox photos
   w=800   for portfolio tile covers
   w=600   for event card photos
─────────────────────────────────────────────────────────────────*/
const cl = (url, w = 1200) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", `/upload/w_${w},q_auto,f_auto/`);
};

/* ── Hero slider images ─────────────────────────────────────────
   To swap or reorder photos just change the order of URLs here.
─────────────────────────────────────────────────────────────────*/
const HERO_SLIDES = [
    "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775416603/20251122151713_IMG_2208_dvqzlb.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775419027/20251122082238_IMG_2024_afwylk.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775419480/20251129222031_IMG_2640_xpdehb.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775419873/20260215220045_IMG_3021_ed2yxb.jpg",
];

/* ── Events — each has a media[] array with mixed photos & videos ──
   type:  "photo" | "video"
   src:   Cloudinary URL for photos, YouTube embed URL for videos
   thumb: optional thumbnail image for video (Cloudinary URL)
   Leave src:"" to show placeholder.
─────────────────────────────────────────────────────────────────*/
const events = [
    {
        event: "Wrocław Tattoo Convention",
        location: "Wrocław, PL", year: "2024", kind: "Convention",
        caption: "Three days, two guest spots. Photos from the floor and a process video from the final session.",
        span: "wide",
        media: [
            {type: "photo", src: ""},
            {type: "photo", src: ""},
            {type: "video", src: "https://www.youtube.com/embed/YOUR_VIDEO_ID"},
            {type: "photo", src: ""},
        ],
    },
    {
        event: "Warsaw Ink Fest",
        location: "Warsaw, PL", year: "2024", kind: "Guest Spot",
        caption: "Process video — surrealist eye piece, forearm. Plus setup shots and the finished healed result.",
        span: "tall",
        media: [
            {type: "video", src: "https://www.youtube.com/embed/YOUR_VIDEO_ID"},
            {type: "photo", src: ""},
            {type: "photo", src: ""},
        ],
    },
    {
        event: "Berlin Tattoo Week",
        location: "Berlin, DE", year: "2023", kind: "Award",
        caption: "Best Surrealism award. Studio shots and a reel from the closing ceremony.",
        span: "",
        media: [
            {type: "photo", src: ""},
            {type: "video", src: "https://www.youtube.com/embed/YOUR_VIDEO_ID"},
            {type: "photo", src: ""},
        ],
    },
    {
        event: "Kraków Tattoo Expo",
        location: "Kraków, PL", year: "2023", kind: "Convention",
        caption: "Three days of conventions, four pieces. Behind the scenes and work in progress.",
        span: "",
        media: [
            {type: "photo", src: ""},
            {type: "photo", src: ""},
            {type: "video", src: "https://www.youtube.com/embed/YOUR_VIDEO_ID"},
        ],
    },
    {
        event: "Prague Tattoo Festival",
        location: "Prague, CZ", year: "2022", kind: "Guest Spot",
        caption: "Five days, six pieces. Collaboration shots and a documentary short from the week.",
        span: "wide",
        media: [
            {type: "photo", src: ""},
            {type: "video", src: "https://www.youtube.com/embed/YOUR_VIDEO_ID"},
            {type: "photo", src: ""},
            {type: "photo", src: ""},
        ],
    },
];

const arts = [
    <svg key={0} viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg"
         style={{width: "100%", height: "100%", opacity: .5}}>
        <ellipse cx="200" cy="200" rx="130" ry="170" fill="none" stroke="#fff" strokeWidth=".8"/>
        <ellipse cx="200" cy="200" rx="95" ry="130" fill="none" stroke="#444" strokeWidth=".4"/>
        <ellipse cx="200" cy="200" rx="58" ry="80" fill="none" stroke="#fff" strokeWidth=".6"/>
        <circle cx="200" cy="200" r="22" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <circle cx="200" cy="200" r="7" fill="#fff" opacity=".6"/>
        <line x1="200" y1="30" x2="200" y2="70" stroke="#333" strokeWidth=".5"/>
        <line x1="200" y1="330" x2="200" y2="370" stroke="#333" strokeWidth=".5"/>
        <path d="M200 370 C200 370,195 400,198 430 C201 460,200 490,200 500" fill="none" stroke="#fff" strokeWidth=".8"
              strokeLinecap="round"/>
    </svg>,
    <svg key={1} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg"
         style={{width: "100%", height: "100%", opacity: .5}}>
        <ellipse cx="140" cy="160" rx="80" ry="110" fill="none" stroke="#fff" strokeWidth=".7"/>
        <ellipse cx="140" cy="120" rx="44" ry="56" fill="none" stroke="#aaa" strokeWidth=".5"/>
        <circle cx="126" cy="112" r="10" fill="none" stroke="#ccc" strokeWidth=".8"/>
        <circle cx="154" cy="112" r="10" fill="none" stroke="#ccc" strokeWidth=".8"/>
        <circle cx="126" cy="112" r="4" fill="#888"/>
        <circle cx="154" cy="112" r="4" fill="#888"/>
        <path d="M130 136 Q140 148 150 136" fill="none" stroke="#ccc" strokeWidth=".8"/>
    </svg>,
    <svg key={2} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg"
         style={{width: "100%", height: "100%", opacity: .55}}>
        <circle cx="140" cy="140" r="88" fill="none" stroke="#444" strokeWidth=".4"/>
        <circle cx="140" cy="140" r="62" fill="none" stroke="#fff" strokeWidth=".7"/>
        <polygon points="140,55 215,200 65,200" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <polygon points="140,225 65,80 215,80" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <circle cx="140" cy="140" r="14" fill="none" stroke="#fff" strokeWidth=".8"/>
    </svg>,
    <svg key={3} viewBox="0 0 280 380" xmlns="http://www.w3.org/2000/svg"
         style={{width: "100%", height: "100%", opacity: .48}}>
        <line x1="140" y1="370" x2="140" y2="60" stroke="#aaa" strokeWidth=".9" strokeLinecap="round"/>
        {[0, 1, 2, 3].map(i => {
            const y = 340 - i * 70, d = i % 2 === 0 ? -1 : 1;
            return (
                <g key={i}>
                    <path d={`M140 ${y} C${140 + d * 28} ${y - 18},${140 + d * 55} ${y - 44},${140 + d * 50} ${y - 65}`}
                          fill="none" stroke="#aaa" strokeWidth=".8"/>
                    <ellipse cx={140 + d * 50} cy={y - 65} rx="13" ry="8"
                             transform={`rotate(${d * -30},${140 + d * 50},${y - 65})`} fill="none" stroke="#aaa"
                             strokeWidth=".7"/>
                </g>);
        })}
        <ellipse cx="140" cy="55" rx="9" ry="13" fill="none" stroke="#aaa" strokeWidth=".8"/>
    </svg>,
    <svg key={4} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg"
         style={{width: "100%", height: "100%", opacity: .48}}>
        <path d="M140 30 C140 30,100 90,80 150 C60 210,90 270,140 290 C190 270,220 210,200 150 C180 90,140 30,140 30Z"
              fill="none" stroke="#fff" strokeWidth=".8"/>
        <circle cx="140" cy="110" r="16" fill="none" stroke="#ccc" strokeWidth=".7"/>
        <circle cx="140" cy="110" r="6" fill="#777" opacity=".6"/>
    </svg>,
    <svg key={5} viewBox="0 0 280 340" xmlns="http://www.w3.org/2000/svg"
         style={{width: "100%", height: "100%", opacity: .48}}>
        {[0, 1, 2, 3, 4].map(i => <path key={i}
                                        d={`M40 ${110 + i * 32} Q80 ${82 + i * 32},140 ${110 + i * 32} Q200 ${138 + i * 32},240 ${110 + i * 32}`}
                                        fill="none" stroke="#aaa" strokeWidth={1.4 - i * .18} opacity={1 - i * .15}/>)}
        <circle cx="140" cy="278" r="40" fill="none" stroke="#aaa" strokeWidth=".8"/>
    </svg>,
];

/* ── 6 featured tiles ───────────────────────────────────────────
   cover:  Single best shot — shown in the grid
   photos: Different angles of THIS piece only — shown in lightbox
─────────────────────────────────────────────────────────────────*/
const works = [
    {
        id: 1, title: "Who am I", bg: "#161616",
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775736685/20251129221852_IMG_2627_kffela.jpg",
        photos: [
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775736685/20251129221852_IMG_2627_kffela.jpg"
        ],
    },
    {
        id: 2, title: "Damn good coffee!", bg: "#111",
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775773395/IMG_2368_q5iz7u.jpg",
        photos: ["https://res.cloudinary.com/duv5eqvwu/image/upload/v1775773395/IMG_2368_q5iz7u.jpg"]
    },
    {
        id: 3, title: "Ban", bg: "#1a1a1a",
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124771/20260417201059_IMG_3469_sjpb5y.jpg",
        photos: ["https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124784/20260417201030_IMG_3464_qs6okr.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124772/20260417200909_IMG_3453_muktag.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124771/20260417200903_IMG_3451_dv0lyi.jpg"]
    },
    {
        id: 4, title: "Hope", bg: "#131313",
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767271/7_oqgkkp.jpg",
        photos: ["https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767271/7_oqgkkp.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767270/8_a3gkwh.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767270/6_vtpigm.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767270/4_jvbfly.jpg"]
    },
    {
        id: 5, title: "Big Brother is watching you", bg: "#0f0f0f",
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770921/IMG_20250630_202500_698_xh86sr.jpg",
        photos: ["https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770921/IMG_20250630_202500_698_xh86sr.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770921/IMG_20250630_202500_719_fa1psi.jpg"]
    },
    {
        id: 6, title: "Gravity Fails", bg: "#181818",
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770453/IMG_2853_1_wjw0tu.jpg",
        photos: ["https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770453/IMG_2853_1_wjw0tu.jpg"]
    },
];

/* ── Full portfolio ──────────────────────────────────────────────
   Two types of entries:

   Single photo — just a URL string:
   "https://res.cloudinary.com/.../photo.jpg"

   Group (same piece, different angles) — object with cover + photos:
   {
     cover:  "https://res.cloudinary.com/.../best_angle.jpg",
     photos: [
       "https://res.cloudinary.com/.../angle1.jpg",
       "https://res.cloudinary.com/.../angle2.jpg",
       "https://res.cloudinary.com/.../angle3.jpg",
     ]
   }
   Grid shows the cover with a carousel icon.
   Click → slider opens with all photos in that group.
─────────────────────────────────────────────────────────────────*/
const allWorks = [
    // Single photos
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775768792/17_ubfeea.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775773395/IMG_2368_q5iz7u.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775736685/20251129221852_IMG_2627_kffela.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767267/20251123193227_IMG_2430_wqod8g.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775745653/IMG_20250703_232524_476_k12zoa.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770453/IMG_2853_1_wjw0tu.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775745652/IMG_20250630_020833_553_fzfoaa.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775736691/IMG_20240720_110313_982_x93spk.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775736682/20260215220045_IMG_3021_nw4k23.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775745666/IMG_20250920_202823_362_npycab.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767275/IMG_20250522_170931_924_qbjfez.jpg",
    "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775745656/IMG_20250707_212001_055_lnijwk.jpg",

    // Group example — same piece, different angles

    {
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775745656/IMG_20250809_141212_785_vuzrwg.jpg",
        photos: [
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775745656/IMG_20250809_141212_785_vuzrwg.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775745656/IMG_20250809_141222_070_sfazk8.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1775745794/IMG_20250809_141222_323_zc68eg.jpg",
        ]
    },
    {
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767271/7_oqgkkp.jpg",
        photos: [
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767271/7_oqgkkp.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767270/8_a3gkwh.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767270/6_vtpigm.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775767270/4_jvbfly.jpg"
        ]
    },
    {
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124771/20260417201059_IMG_3469_sjpb5y.jpg",
        photos: [
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124784/20260417201030_IMG_3464_qs6okr.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124772/20260417200909_IMG_3453_muktag.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/v1777124771/20260417200903_IMG_3451_dv0lyi.jpg"
        ]
    },
    {
        cover: "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770921/IMG_20250630_202500_698_xh86sr.jpg",
        photos: [
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770921/IMG_20250630_202500_698_xh86sr.jpg",
            "https://res.cloudinary.com/duv5eqvwu/image/upload/q_auto/f_auto/v1775770921/IMG_20250630_202500_719_fa1psi.jpg"]
    }
];

const processList = [
    {
        n: "01",
        title: "Consultation",
        body: "We meet — in person or remotely — and talk about your vision, your body, your story. No forms, no templates. This conversation is the foundation of the piece."
    },
    {
        n: "02",
        title: "Design",
        body: "A custom composition developed exclusively for you. Scale, placement, and balance considered together — because a tattoo is part of your body's architecture."
    },
    {
        n: "03",
        title: "Execution",
        body: "Unhurried, precise, focused entirely on your piece. What gets made here will never be tattooed on another person."
    },
];

const faqs = [
    {q: "What style do you work in?", a: "Surrealism, realism - black and grey."},
    {
        q: "How long does a consultation take?",
        a: "30–60 minutes. We go deep into your concept, reference imagery, placement, and scale. No obligation, no rush."
    },
    {
        q: "Do you accept walk-ins?",
        a: "No. Every session is booked in advance. Custom work requires time to design properly."
    },
    {
        q: "How far ahead are you booking?",
        a: "Currently 2–3 weeks out. Reach out early — popular time slots fill up first."
    },
    {q: "Do you travel for guest spots?", a: "Yes, 6–8 times per year. Follow on Instagram to see upcoming dates."},
];

const testimonials = [
    {
        quote: "She spent two hours on the consultation alone. The result felt like she'd read my mind — and then improved it.",
        name: "Emilia R.",
        city: "Wrocław"
    },
    {
        quote: "I've had work done in four countries. This is the only studio that's ever made me genuinely nervous — in the best possible way.",
        name: "Jonas T.",
        city: "Berlin"
    },
    {
        quote: "The piece still stops people cold. It looks impossible. That's exactly what I wanted.",
        name: "Petra L.",
        city: "Warsaw"
    },
];

function useCounter(t, dur = 1800, active = false) {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!active) return;
        let s = null;
        const step = ts => {
            if (!s) s = ts;
            const p = Math.min((ts - s) / dur, 1);
            setV(Math.floor(p * t));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [active, t, dur]);
    return v;
}

function useVisible(ref) {
    const [vis, setVis] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const o = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVis(true);
        }, {threshold: .15});
        o.observe(ref.current);
        return () => o.disconnect();
    }, [ref]);
    return vis;
}

/* ── Video lightbox ── */
/* ── Gallery lightbox ────────────────────────────────────────── */
/* ── Portfolio grid overlay ──────────────────────────────────────
   Editorial masonry — alternating sizes, asymmetric rhythm.
   Groups show a stack indicator — click opens slider.
─────────────────────────────────────────────────────────────────*/

/* ── Portfolio overlay ────────────────────────────────────────────
   Desktop: chaotic portrait-priority tile grid
   Mobile:  vertical scroll feed, tap to open
─────────────────────────────────────────────────────────────────*/
function PortfolioGrid({items, onSelect, onClose, savedScroll, onScroll, isHidden}) {
    const mono = {fontFamily: "'DM Mono',monospace"};
    const [hov, setHov] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fn = e => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", fn);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", fn);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    useEffect(() => {
        if (savedScroll && scrollRef.current) scrollRef.current.scrollTop = savedScroll;
    }, [savedScroll]);

    /* Desktop — all single column, varied height for rhythm */
    const pattern = [
        {c: 1, r: 3}, {c: 1, r: 2}, {c: 1, r: 4}, {c: 1, r: 2},
        {c: 1, r: 2}, {c: 1, r: 3}, {c: 1, r: 2}, {c: 1, r: 4},
        {c: 1, r: 4}, {c: 1, r: 2}, {c: 1, r: 3}, {c: 1, r: 2},
    ];

    const GroupDot = () => (
        <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            gap: 3,
            pointerEvents: "none",
            zIndex: 3
        }}>
            <div style={{width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.85)"}}/>
            <div style={{width: 8, height: 1.5, background: "rgba(255,255,255,.85)"}}/>
        </div>
    );

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "#080808",
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn .3s ease",
            zIndex: isHidden ? 499 : 500,
            pointerEvents: isHidden ? "none" : "all"
        }}>

            {/* nav */}
            <div style={{
                flexShrink: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 24px",
                height: 64,
                background: "rgba(8,8,8,.97)",
                borderBottom: "1px solid #1a1a1a",
                zIndex: 10
            }}>
                <p style={{
                    ...mono,
                    fontSize: 9,
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    color: "#444"
                }}>{items.length} Works</p>
                <button onClick={onClose}
                        style={{
                            ...mono,
                            fontSize: 10,
                            letterSpacing: ".16em",
                            textTransform: "uppercase",
                            color: "#aaa",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color .3s"
                        }}
                        onMouseEnter={e => e.target.style.color = "#fff"}
                        onMouseLeave={e => e.target.style.color = "#aaa"}>Close ×
                </button>
            </div>

            {/* scroll area */}
            <div ref={scrollRef} style={{overflowY: "auto", flex: 1}}
                 onScroll={e => onScroll && onScroll(e.currentTarget.scrollTop)}>

                {/* ── DESKTOP: chaotic portrait grid ── */}
                <div className="port-overlay-desktop">
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gridAutoRows: "140px",
                        gap: 2,
                        padding: 2
                    }}>
                        {items.map((item, i) => {
                            const isGroup = typeof item === "object";
                            const coverSrc = isGroup ? item.cover : item;
                            const p = pattern[i % pattern.length];
                            const isHov = hov === i;
                            return (
                                <div key={i}
                                     onClick={() => onSelect(i)}
                                     onMouseEnter={() => setHov(i)}
                                     onMouseLeave={() => setHov(null)}
                                     style={{
                                         gridColumn: `span ${p.c}`,
                                         gridRow: `span ${p.r}`,
                                         position: "relative",
                                         overflow: "hidden",
                                         cursor: "pointer",
                                         background: "#0d0d0d"
                                     }}>
                                    <img src={cl(coverSrc, 800)} alt=""
                                         style={{
                                             width: "100%", height: "100%", objectFit: "cover", display: "block",
                                             transition: "transform .6s cubic-bezier(.25,.46,.45,.94),opacity .4s",
                                             transform: isHov ? "scale(1.04)" : "scale(1)", opacity: isHov ? .72 : 1
                                         }}/>
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(0,0,0,.3)",
                                        opacity: isHov ? 1 : 0,
                                        transition: "opacity .4s",
                                        pointerEvents: "none"
                                    }}/>
                                    {isGroup && item.photos.length > 1 && <GroupDot/>}
                                    <div style={{
                                        position: "absolute",
                                        bottom: 8,
                                        left: 10, ...mono,
                                        fontSize: 7,
                                        letterSpacing: ".15em",
                                        color: "rgba(255,255,255,.3)",
                                        opacity: isHov ? 1 : 0,
                                        transition: "opacity .3s",
                                        pointerEvents: "none"
                                    }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── MOBILE: vertical scroll feed ── */}
                <div className="port-overlay-mobile">
                    {items.map((item, i) => {
                        const isGroup = typeof item === "object";
                        const coverSrc = isGroup ? item.cover : item;
                        return (
                            <div key={i}
                                 onClick={() => onSelect(i)}
                                 style={{position: "relative", cursor: "pointer", borderBottom: "1px solid #111"}}>
                                <div style={{
                                    width: "100%",
                                    aspectRatio: "4/3",
                                    overflow: "hidden",
                                    background: "#0d0d0d",
                                    position: "relative"
                                }}>
                                    <img src={cl(coverSrc, 800)} alt=""
                                         style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}/>
                                    {isGroup && item.photos.length > 1 && <GroupDot/>}
                                </div>
                            </div>
                        );
                    })}
                    <div style={{height: 60}}/>
                </div>

            </div>
        </div>
    );
}

function GalleryLightbox({photos: rawPhotos, title, startIdx = 0, onClose, onBack}) {
    const mono = {fontFamily: "'DM Mono',monospace"};
    const photos = (rawPhotos || []).filter(p => p);
    const total = photos.length;
    const [idx, setIdx] = useState(startIdx);
    const touchX = useRef(null);

    const goNext = useCallback(() => setIdx(i => (i + 1) % total), [total]);
    const goPrev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);

    useEffect(() => {
        const fn = e => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [onClose, goNext, goPrev]);

    const onTouchStart = e => {
        touchX.current = e.touches[0].clientX;
    };
    const onTouchEnd = e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) {
            dx < 0 ? goNext() : goPrev();
        }
        touchX.current = null;
    };

    if (total === 0) return null;

    return (
        <div
            onClick={e => {
                if (e.target === e.currentTarget) {
                    onBack ? onBack() : onClose();
                }
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 600,
                background: "rgba(0,0,0,.96)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: "none"
            }}>

            <div style={{position: "absolute", top: 20, left: 24, zIndex: 10}}>
                <p style={{
                    ...mono,
                    fontSize: 8,
                    letterSpacing: ".2em",
                    color: "#444"
                }}>{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
            </div>

            {onBack && (
                <button onClick={onBack}
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 24, ...mono,
                            fontSize: 9,
                            letterSpacing: ".18em",
                            textTransform: "uppercase",
                            color: "#555",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color .3s",
                            zIndex: 10
                        }}
                        onMouseEnter={e => e.target.style.color = "#fff"}
                        onMouseLeave={e => e.target.style.color = "#555"}>← Back</button>
            )}

            <div style={{
                position: "relative",
                width: "min(900px,92vw)",
                maxHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            }}>
                <img src={cl(photos[idx], 1200)} alt=""
                     style={{
                         width: "100%",
                         maxWidth: "100%",
                         maxHeight: "80vh",
                         objectFit: "contain",
                         display: "block",
                         userSelect: "none",
                         WebkitUserDrag: "none"
                     }}/>
            </div>

            {total > 1 && (
                <>
                    <button className="lb-arrow" onClick={goPrev}
                            style={{
                                position: "absolute",
                                left: 16,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 44,
                                height: 44,
                                background: "rgba(8,8,8,.65)",
                                border: "1px solid rgba(255,255,255,.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "border-color .25s",
                                zIndex: 10
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.5)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderLeft: "1px solid #fff",
                            borderBottom: "1px solid #fff",
                            transform: "rotate(45deg)",
                            marginLeft: 3
                        }}/>
                    </button>
                    <button className="lb-arrow" onClick={goNext}
                            style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 44,
                                height: 44,
                                background: "rgba(8,8,8,.65)",
                                border: "1px solid rgba(255,255,255,.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "border-color .25s",
                                zIndex: 10
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.5)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRight: "1px solid #fff",
                            borderTop: "1px solid #fff",
                            transform: "rotate(45deg)",
                            marginRight: 3
                        }}/>
                    </button>
                </>
            )}

            {total > 1 && total <= 30 && (
                <div style={{
                    display: "flex",
                    gap: 5,
                    marginTop: 18,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "80vw",
                    zIndex: 10
                }}>
                    {photos.map((_, i) => (
                        <div key={i} onClick={() => setIdx(i)}
                             style={{
                                 width: i === idx ? 14 : 4,
                                 height: 4,
                                 borderRadius: 2,
                                 background: i === idx ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.18)",
                                 cursor: "pointer",
                                 transition: "all .3s"
                             }}/>
                    ))}
                </div>
            )}
            {total > 30 && (
                <p style={{
                    ...mono,
                    marginTop: 16,
                    fontSize: 8,
                    letterSpacing: ".2em",
                    color: "#444"
                }}>{idx + 1} / {total}</p>
            )}
        </div>
    );
}

function VideoLightbox({src, label, onClose}) {
    const mono = {fontFamily: "'DM Mono',monospace"};
    useEffect(() => {
        const fn = e => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [onClose]);
    return (
        <div onClick={e => {
            if (e.target === e.currentTarget) {
                onBack ? onBack() : onClose();
            }
        }} style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "rgba(0,0,0,.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn .35s ease"
        }}>
            <div style={{position: "relative", width: "min(900px,90vw)", aspectRatio: "16/9"}}>
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: -38,
                    right: 0, ...mono,
                    fontSize: 9,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "#555",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    transition: "color .3s"
                }} onMouseEnter={e => e.target.style.color = "#fff"}
                        onMouseLeave={e => e.target.style.color = "#555"}>Close ×
                </button>
                <iframe src={src + "?autoplay=1"} title={label} allowFullScreen
                        style={{width: "100%", height: "100%", border: "none", display: "block"}}/>
                <p style={{
                    ...mono,
                    position: "absolute",
                    bottom: -34,
                    left: 0,
                    fontSize: 9,
                    letterSpacing: ".15em",
                    color: "#333"
                }}>{label}</p>
            </div>
        </div>
    );
}

/* ── Event card with internal media gallery ── */
function EventCard({ev, cardIndex, onVideoOpen}) {
    const serif = {fontFamily: "'Cormorant Garamond',serif"};
    const mono = {fontFamily: "'DM Mono',monospace"};
    const [cur, setCur] = useState(0);
    const [hov, setHov] = useState(false);
    const [fading, setFading] = useState(false);
    const touchStartX = useRef(null);
    /* videos first — always shown as cover */
    const media = [...ev.media].sort((a, b) => a.type === "video" ? -1 : b.type === "video" ? 1 : 0);
    const count = media.length;

    const bgColors = ["#0d0d0d", "#111", "#0c0c0c", "#131313", "#0f0f0f", "#161616"];
    const bg = bgColors[cardIndex % bgColors.length];

    const goTo = useCallback((idx) => {
        if (idx === cur || fading) return;
        setFading(true);
        setTimeout(() => {
            setCur(idx);
            setFading(false);
        }, 320);
    }, [cur, fading]);

    const next = useCallback((e) => {
        e.stopPropagation();
        goTo((cur + 1) % count);
    }, [cur, count, goTo]);
    const prev = useCallback((e) => {
        e.stopPropagation();
        goTo((cur - 1 + count) % count);
    }, [cur, count, goTo]);

    /* touch / swipe handlers */
    const onCardTouchStart = e => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onCardTouchEnd = e => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) {
            dx < 0 ? goTo((cur + 1) % count) : goTo((cur - 1 + count) % count);
        }
        touchStartX.current = null;
    };

    /* keyboard nav when hovered */
    useEffect(() => {
        if (!hov) return;
        const fn = e => {
            if (e.key === "ArrowRight") goTo((cur + 1) % count);
            if (e.key === "ArrowLeft") goTo((cur - 1 + count) % count);
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [hov, cur, count, goTo]);

    const item = media[cur];
    const isVideo = item.type === "video";
    const hasRealSrc = item.src && !item.src.includes("YOUR_VIDEO_ID");

    const spanStyle = {};
    if (ev.span === "wide") spanStyle.gridColumn = "span 2";
    if (ev.span === "tall") spanStyle.gridRow = "span 2";
    if (ev.span === "full") spanStyle.gridColumn = "span 3";

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onTouchStart={onCardTouchStart}
            onTouchEnd={onCardTouchEnd}
            onClick={() => {
                if (isVideo && hasRealSrc) onVideoOpen(item.src, ev.event);
            }}
            style={{
                position: "relative",
                overflow: "hidden",
                background: bg,
                cursor: isVideo && hasRealSrc ? "pointer" : "default", ...spanStyle
            }}
        >
            {/* ── MEDIA ── */}
            <div style={{position: "absolute", inset: 0, opacity: fading ? 0 : 1, transition: "opacity .32s ease"}}>
                {isVideo && hasRealSrc ? (
                    /* video thumbnail — don't embed, show art + play */
                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: .18,
                            transition: "opacity .5s", ...(hov ? {opacity: .28} : {})
                        }}>

                            {arts[cardIndex % arts.length]}
                        </div>
                    </div>
                ) : item.src ? (
                    <img src={cl(item.src, 600)} alt={ev.event} style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform .7s cubic-bezier(.25,.46,.45,.94)",
                        transform: hov ? "scale(1.04)" : "scale(1)"
                    }}/>
                ) : (
                    /* placeholder */
                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: hov ? .22 : .14,
                            transition: "opacity .5s"
                        }}>
                            {arts[cardIndex % arts.length]}
                        </div>
                    </div>
                )}
            </div>

            {/* gradient shade */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.08) 48%,transparent 100%)",
                pointerEvents: "none",
                zIndex: 2
            }}/>

            {/* play button overlay for video slides */}
            {isVideo && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 4,
                    pointerEvents: "none"
                }}>
                    <div
                        style={{position: "relative", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <div style={{
                            position: "absolute",
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,.07)",
                            animation: "ring 2.2s ease-in-out infinite"
                        }}/>
                        <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            border: "1px solid",
                            borderColor: hov ? "rgba(255,255,255,.65)" : "rgba(255,255,255,.22)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all .3s",
                            background: hov ? "rgba(255,255,255,.07)" : "transparent"
                        }}>
                            <div style={{
                                width: 0,
                                height: 0,
                                borderStyle: "solid",
                                borderWidth: "7px 0 7px 12px",
                                borderColor: "transparent transparent transparent rgba(255,255,255,.85)",
                                marginLeft: 3
                            }}/>
                        </div>
                    </div>
                </div>
            )}

            {/* media type badge */}
            <div style={{
                position: "absolute",
                top: 14,
                right: 14,
                zIndex: 6, ...mono,
                fontSize: 7,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                padding: "3px 9px",
                background: "rgba(8,8,8,.88)",
                border: "1px solid",
                borderColor: hov ? "#333" : "rgba(255,255,255,.1)",
                color: hov ? "#888" : "#555",
                transition: "all .3s"
            }}>
                {isVideo ? "▶ Video" : "Photo"}
            </div>

            {/* counter */}
            {count > 1 && (
                <div style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 6, ...mono,
                    fontSize: 8,
                    letterSpacing: ".18em",
                    color: hov ? "rgba(255,255,255,.65)" : "rgba(255,255,255,.3)",
                    transition: "color .3s"
                }}>
                    {String(cur + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </div>
            )}

            {/* nav arrows */}
            {count > 1 && (
                <>
                    <button className="ev-nav-arrow" onClick={prev} style={{
                        position: "absolute",
                        left: 10,
                        top: "45%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: 36,
                        height: 36,
                        background: "rgba(8,8,8,.65)",
                        border: "1px solid rgba(255,255,255,.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        opacity: hov ? 1 : 0,
                        transition: "opacity .3s,background .2s,border-color .2s"
                    }} onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"}>
                        <div style={{
                            width: 7,
                            height: 7,
                            borderRight: "1px solid #fff",
                            borderTop: "1px solid #fff",
                            transform: "rotate(-135deg)",
                            marginLeft: 2
                        }}/>
                    </button>
                    <button className="ev-nav-arrow" onClick={next} style={{
                        position: "absolute",
                        right: 10,
                        top: "45%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: 36,
                        height: 36,
                        background: "rgba(8,8,8,.65)",
                        border: "1px solid rgba(255,255,255,.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        opacity: hov ? 1 : 0,
                        transition: "opacity .3s,background .2s,border-color .2s"
                    }} onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"}>
                        <div style={{
                            width: 7,
                            height: 7,
                            borderRight: "1px solid #fff",
                            borderTop: "1px solid #fff",
                            transform: "rotate(45deg)",
                            marginRight: 2
                        }}/>
                    </button>
                </>
            )}

            {/* dot navigation */}
            {count > 1 && (
                <div style={{
                    position: "absolute",
                    bottom: 106,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    zIndex: 6
                }}>
                    {media.map((_, i) => (
                        <div key={i} onClick={e => {
                            e.stopPropagation();
                            goTo(i);
                        }}
                             style={{
                                 width: i === cur ? 16 : 4,
                                 height: 4,
                                 borderRadius: 2,
                                 background: i === cur ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.22)",
                                 transition: "all .3s",
                                 cursor: "pointer"
                             }}/>
                    ))}
                </div>
            )}

            {/* info block */}
            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "18px 20px 20px",
                zIndex: 5,
                transform: hov ? "translateY(0)" : "translateY(5px)",
                transition: "transform .4s cubic-bezier(.25,.46,.45,.94)"
            }}>
                <div style={{display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap"}}>
                    {[ev.year, ev.location, ev.kind].map(t => (
                        <span key={t} style={{
                            ...mono,
                            fontSize: 7,
                            letterSpacing: ".18em",
                            textTransform: "uppercase",
                            color: "#777",
                            border: "1px solid rgba(255,255,255,.1)",
                            padding: "2px 7px"
                        }}>{t}</span>
                    ))}
                </div>
                <p style={{
                    fontSize: "clamp(17px,2.2vw,22px)",
                    fontWeight: 300,
                    lineHeight: 1.15,
                    marginBottom: 5,
                    position: "relative",
                    display: "inline-block"
                }}>
                    {ev.event}
                    <span style={{
                        position: "absolute",
                        bottom: -3,
                        left: 0,
                        height: 1,
                        background: W,
                        transition: "width .5s cubic-bezier(.25,.46,.45,.94)",
                        width: hov ? "100%" : "0"
                    }}/>
                </p>
                <p style={{
                    ...mono,
                    fontSize: 10,
                    lineHeight: 1.7,
                    color: "#555",
                    overflow: "hidden",
                    maxHeight: hov ? 56 : 0,
                    transition: "max-height .4s .05s,opacity .4s",
                    opacity: hov ? 1 : 0
                }}>{ev.caption}</p>
            </div>
        </div>
    );
}

export default function Inksomna() {
    const serif = {fontFamily: "'Cormorant Garamond',serif"};
    const mono = {fontFamily: "'DM Mono',monospace"};

    const [slide, setSlide] = useState(0);
    const [heroFade, setHeroFade] = useState(true);
    const heroTouchX = useRef(null);
    const heroMouseX = useRef(null);

    const heroNext = () => {
        setHeroFade(false);
        setTimeout(() => {
            setSlide(s => (s + 1) % HERO_SLIDES.length);
            setHeroFade(true);
        }, 320);
    };
    const heroPrev = () => {
        setHeroFade(false);
        setTimeout(() => {
            setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
            setHeroFade(true);
        }, 320);
    };

    /* touch handlers */
    const onTouchStart = e => {
        heroTouchX.current = e.touches[0].clientX;
    };
    const onTouchEnd = e => {
        if (heroTouchX.current === null) return;
        const dx = e.changedTouches[0].clientX - heroTouchX.current;
        if (Math.abs(dx) > 40) {
            dx < 0 ? heroNext() : heroPrev();
        }
        heroTouchX.current = null;
    };
    /* mouse drag handlers */
    const onMouseDown = e => {
        heroMouseX.current = e.clientX;
    };
    const onMouseUp = e => {
        if (heroMouseX.current === null) return;
        const dx = e.clientX - heroMouseX.current;
        if (Math.abs(dx) > 40) {
            dx < 0 ? heroNext() : heroPrev();
        }
        heroMouseX.current = null;
    };
    const [faqOpen, setFaqOpen] = useState(null);
    const [testIdx, setTestIdx] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mounted,  setMounted]  = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [igOpen, setIgOpen] = useState(false);
    const [video, setVideo] = useState(null);
    const [gallery, setGallery] = useState(null);
    const [portGrid, setPortGrid] = useState(false);
    const [gridScroll, setGridScroll] = useState(0);
    const galleryFromGrid = useRef(false);
    const overlayStack = useRef([]);
    const [form, setForm] = useState({name: "", email: "", message: ""});
    const [sent, setSent] = useState(false);

    const statsRef = useRef(null);
    const statsVis = useVisible(statsRef);
    const c1 = useCounter(12, 1600, statsVis);
    const c2 = useCounter(500, 1800, statsVis);
    const c3 = useCounter(8, 1200, statsVis);

    useEffect(() => {
        const id = setInterval(() => {
            setHeroFade(false);
            setTimeout(() => {
                setSlide(s => (s + 1) % HERO_SLIDES.length);
                setHeroFade(true);
            }, 380);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const fn = e => {
            if (e.key === "Escape") {
                setIgOpen(false);
                setVideo(null);
                setGallery(null);
                setPortGrid(false);
            }
        };

        /* Handle phone back button */
        const onPop = () => {
            const top = overlayStack.current.pop();
            if (top === "gallery") {
                setGallery(null);
                if (galleryFromGrid.current) {
                    galleryFromGrid.current = false;
                    setPortGrid(true);
                    /* grid entry already in history — no pushState needed */
                }
            } else if (top === "grid") {
                setPortGrid(false);
                const s = parseInt(document.body.dataset.mainScroll||"0");
                requestAnimationFrame(()=>window.scrollTo(0,s));
            } else if (top === "ig") {
                setIgOpen(false);
            }
        };
        window.addEventListener("popstate", onPop);
        window.addEventListener("keydown", fn);
        return () => {
            window.removeEventListener("keydown", fn);
            window.removeEventListener("popstate", onPop);
        };
    }, []);

    useEffect(() => {
        const onS = () => setScrolled(window.scrollY > 30);
        requestAnimationFrame(()=>setMounted(true));
        window.addEventListener("scroll", onS);
        const lk = document.createElement("link");
        lk.rel = "stylesheet";
        lk.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400&display=swap";
        document.head.appendChild(lk);
        const st = document.createElement("style");
        st.textContent = `
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;overflow-x:hidden}
body{overflow-x:hidden;max-width:100vw}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0e0e0e}::-webkit-scrollbar-thumb{background:#444}
.nl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#aaa;cursor:pointer;position:relative;padding-bottom:3px;transition:color .3s;background:none;border:none}
.nl::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#fff;transition:width .35s}
.nl:hover{color:#fff}.nl:hover::after{width:100%}
.btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;padding:13px 36px;background:transparent;border:1px solid #fff;color:#fff;cursor:pointer;transition:background .25s,color .25s;white-space:nowrap;outline:none}
.btn:focus{outline:none;background:transparent;color:#fff}
.btn:hover{background:#fff;color:#0e0e0e}
.btn-sm{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;padding:10px 22px;background:transparent;border:1px solid #333;color:#aaa;cursor:pointer;transition:all .3s}
.btn-sm:hover{border-color:#fff;color:#fff}
.fi{background:transparent;border:none;border-bottom:1px solid #2e2e2e;color:#fff;font-family:'DM Mono',monospace;font-size:12px;padding:12px 0;width:100%;outline:none;transition:border-color .3s}
.fi:focus{border-color:#fff}.fi::placeholder{color:#444}
textarea.fi{resize:vertical;min-height:120px}
.fl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#999;display:block;margin-bottom:4px;margin-top:22px}
.gi{position:relative;overflow:hidden;cursor:pointer}
.gi .ov{position:absolute;inset:0;background:rgba(0,0,0,.72);opacity:0;transition:opacity .4s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px}
.gi:hover .ov{opacity:1}
.gi .bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:#fff;transform:scaleX(0);transform-origin:left;transition:transform .45s}
.gi:hover .bar{transform:scaleX(1)}
.port-img{transition:transform .7s cubic-bezier(.25,.46,.45,.94)!important}
.gi:hover .port-img,.port-creative div:hover .port-img{transform:scale(1.04)!important}
.port-img{transition:transform .7s cubic-bezier(.25,.46,.45,.94)!important}
.gi:hover .port-img{transform:scale(1.04)!important}
.fc{border:1px solid #1e1e1e;transition:border-color .35s,background .35s}
.fc:hover{border-color:#333;background:#111}

@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .9s ease forwards}
.fu1{animation:fadeUp .9s .15s ease forwards;opacity:0}
.fu2{animation:fadeUp .9s .3s ease forwards;opacity:0}
.fu3{animation:fadeUp .9s .45s ease forwards;opacity:0}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq{animation:marquee 28s linear infinite;white-space:nowrap;display:inline-block}
@keyframes ring{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.35);opacity:0}}
.mob-menu{position:fixed;inset:0;background:#080808;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;transform:translateX(100%);transition:transform .4s cubic-bezier(.25,.46,.45,.94);visibility:hidden}
.mob-menu.open{transform:translateX(0);visibility:visible}
.mosaic{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:380px;gap:3px}
.ig-btn{position:fixed;bottom:28px;right:28px;z-index:150;width:48px;height:48px;border-radius:50%;background:#0e0e0e;border:1px solid #333;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .3s,transform .3s}
.ig-btn:hover{border-color:#fff;transform:scale(1.08)}
.ig-btn::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(255,255,255,.1);animation:igpulse 2.5s ease-in-out infinite}
@keyframes igpulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.18);opacity:0}}
.ig-ov{position:fixed;inset:0;z-index:400;background:#080808;display:none;flex-direction:column;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .5s}
.ig-ov.ready{display:flex;visibility:hidden}
.ig-ov.open{display:flex!important;opacity:1;pointer-events:all!important;visibility:visible!important}
.ig-frame{position:absolute;inset:32px;border:1px solid #1a1a1a;pointer-events:none}
.ig-handle{font-size:clamp(44px,9vw,96px);font-weight:300;font-style:italic;line-height:.9;letter-spacing:-.02em;margin-bottom:28px;opacity:0;transform:translateY(20px);transition:opacity .6s .2s,transform .6s .2s}
.ig-ov.open .ig-handle{opacity:1;transform:translateY(0)}
.ig-desc{font-family:'DM Mono',monospace;font-size:11px;line-height:1.95;color:#666;max-width:320px;margin:0 auto 40px;text-align:center;opacity:0;transition:opacity .6s .35s}
.ig-ov.open .ig-desc{opacity:1}
.ig-cta{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;padding:13px 44px;background:transparent;border:1px solid #fff;color:#fff;cursor:pointer;text-decoration:none;display:inline-block;opacity:0;transition:background .25s,color .25s,opacity .6s .5s}
.ig-ov.open .ig-cta{opacity:1}
.ig-cta:hover{background:#fff;color:#080808}
.ig-stats{position:absolute;bottom:52px;left:0;right:0;display:flex;justify-content:center;gap:64px;opacity:0;transition:opacity .6s .6s}
.ig-ov.open .ig-stats{opacity:1}
.ig-close-btn{position:absolute;top:44px;right:48px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#444;cursor:pointer;background:none;border:none;transition:color .3s}
.ig-close-btn:hover{color:#fff}
.c-mark{position:absolute;width:14px;height:14px}
.c-mark::before,.c-mark::after{content:'';position:absolute;background:#2a2a2a}
.c-mark::before{width:100%;height:1px}
.c-mark::after{width:1px;height:100%}
.proc-mobile{display:none!important}
.proc-desktop{display:grid!important}
@media(max-width:900px){
  .hero-art{width:100%!important;opacity:.8!important}
  .style-grid{grid-template-columns:1fr!important}
  .style-grid .fc{border-left:1px solid #1e1e1e!important;border-top:1px solid #1e1e1e}
  .about-grid{grid-template-columns:1fr!important}
  .about-img{display:none!important}
  .about-img-tablet{display:block!important}
  .about-section{position:relative!important;padding:0!important;min-height:80vh!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important}
  .about-img-bg{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important;z-index:0!important}
  .about-overlay{display:block!important}
  .about-text{position:relative!important;z-index:2!important;padding:40px 32px 52px!important}
  .booking-grid{grid-template-columns:1fr!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .footer-grid{grid-template-columns:1fr 1fr!important}
  .mosaic{grid-template-columns:1fr 1fr!important;grid-auto-rows:300px!important}
  .ig-stats{gap:36px!important;bottom:36px!important}
  .ig-frame{inset:16px!important}
  .ig-close-btn{top:28px!important;right:28px!important}
}
.port-overlay-mobile{display:none}
.port-overlay-desktop{display:block}
@media(max-width:600px){
  .port-overlay-mobile{display:block!important}
  .port-overlay-desktop{display:none!important}
  .nav-links{display:none!important}
  .hamburger{display:flex!important}
  .section-pad{padding:56px 20px!important}
  .hero-pad{padding:0 20px 52px!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .port-grid{grid-template-columns:1fr 1fr!important}
  .port-grid .gi{height:160px!important}
  .port-creative{grid-template-columns:repeat(6,1fr)!important;grid-auto-rows:45px!important}
  .port-creative>div{aspect-ratio:unset!important}
  .port-creative>div:nth-child(1){grid-column:1/4!important;grid-row:1/9!important}
  .port-creative>div:nth-child(2){grid-column:4/7!important;grid-row:1/6!important}
  .port-creative>div:nth-child(3){grid-column:4/7!important;grid-row:6/12!important}
  .port-creative>div:nth-child(4){grid-column:1/4!important;grid-row:9/16!important}
  .port-creative>div:nth-child(5){grid-column:4/7!important;grid-row:12/17!important}
  .port-creative>div:nth-child(6){grid-column:1/4!important;grid-row:16/22!important}

  .port-mobile{grid-template-columns:1fr 1fr!important;grid-auto-rows:160px!important}
  .form-grid{grid-template-columns:1fr!important}
  .footer-grid{grid-template-columns:1fr!important}
  .process-step{gap:14px!important}
  .process-num{font-size:32px!important;width:44px!important}
  .proc-desktop{display:none!important}
  .proc-mobile{display:block!important}
  .booking-info{display:none!important}
  .about-section{position:relative!important;padding:0!important;min-height:100svh!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important}
  .about-img-bg{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important;z-index:0!important}
  .about-img-placeholder{display:none!important}
  .about-overlay{display:block!important}
  .about-text{position:relative!important;z-index:2!important;padding:40px 20px 52px!important;background:none!important}
  .ig-btn{bottom:20px;right:20px;width:42px;height:42px}
  .ig-stats{display:none!important}
  .mosaic{grid-template-columns:1fr!important;grid-auto-rows:280px!important}
  .ev-head-inner{flex-direction:column!important;align-items:flex-start!important;gap:12px!important}
  .lb-arrow{display:none!important}
  .ev-nav-arrow{display:none!important}
}
`;
        document.head.appendChild(st);
        return () => {
            window.removeEventListener("scroll", onS);
            document.head.removeChild(lk);
            document.head.removeChild(st);
        };
    }, []);

    const scrollTo = id => {
        document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
        setMenuOpen(false);
    };

    const SH = ({label, title}) => (
        <div style={{textAlign: "center", marginBottom: 56}}>
            <p style={{
                ...mono,
                fontSize: 9,
                letterSpacing: ".32em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: 14
            }}>{label}</p>
            <h2 style={{
                ...serif,
                fontSize: "clamp(32px,5vw,64px)",
                fontWeight: 300,
                letterSpacing: "-.01em",
                lineHeight: 1
            }}>{title}</h2>
            <div style={{width: 32, height: 1, background: "#1e1e1e", margin: "18px auto 0"}}/>
        </div>
    );

    return (
        <div style={{background: BG, color: W, ...serif, minHeight: "100vh", overflowX: "hidden"}}>

            {/* MOBILE MENU */}
            <div className={`mob-menu${menuOpen ? " open" : ""}`}>
                <button onClick={() => setMenuOpen(false)} style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    background: "none",
                    border: "none",
                    color: W,
                    fontSize: 28,
                    cursor: "pointer",
                    lineHeight: 1
                }}>×
                </button>
                {["Work", "About", "FAQ", "Booking"].map(x => (
                    <button key={x} className="nl" onClick={() => scrollTo(x.toLowerCase())}
                            style={{fontSize: 18, letterSpacing: ".2em"}}>{x}</button>
                ))}
                <button className="nl" onClick={() => {
                    setMenuOpen(false);
                    overlayStack.current.push('ig');
                    history.pushState(null, '', '');
                    setIgOpen(true);
                }} style={{fontSize: 18, letterSpacing: ".2em"}}>Instagram
                </button>
            </div>

            {/* NAV */}
            <nav style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 200,
                padding: "0 24px",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: scrolled ? "rgba(14,14,14,.97)" : "transparent",
                borderBottom: scrolled ? `1px solid ${BD}` : "none",
                backdropFilter: scrolled ? "blur(10px)" : "none",
                transition: "background .4s,border .4s"
            }}>
                <div style={{display: "flex", alignItems: "center", gap: 12, cursor: "pointer"}}
                     onClick={() => scrollTo("home")}>
                    <img src="/logo.svg" alt="Inksomna"
                         style={{height: 36, width: "auto", filter: "brightness(0) invert(1)", opacity: .9}}/>
                    <div style={{display: "flex", flexDirection: "column", lineHeight: 1.1}}>
                        <span style={{
                            ...serif,
                            fontSize: 15,
                            fontWeight: 300,
                            letterSpacing: ".3em",
                            textTransform: "uppercase",
                            color: W
                        }}>Inksomna</span>
                        <span style={{
                            ...mono,
                            fontSize: 7,
                            letterSpacing: ".2em",
                            textTransform: "uppercase",
                            color: "#888",
                            marginTop: 2
                        }}>Tattoo Art · {CITY}</span>
                    </div>
                </div>
                <div className="nav-links" style={{display: "flex", gap: 28, alignItems: "center"}}>
                    {["Work", "Events", "About", "FAQ", "Booking"].map(x => (
                        <button key={x} className="nl" onClick={() => scrollTo(x.toLowerCase())}>{x}</button>
                    ))}
                    <button onClick={() => { overlayStack.current.push('ig'); history.pushState(null,'',''); setIgOpen(true); }} style={{
                        background: "none",
                        border: "1px solid #2a2a2a",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "border-color .3s",
                        marginLeft: 4
                    }} onMouseEnter={e => e.currentTarget.style.borderColor = "#fff"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"
                             strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5"/>
                            <circle cx="12" cy="12" r="4.5"/>
                            <circle cx="17.5" cy="6.5" r="1" fill="#aaa" stroke="none"/>
                        </svg>
                    </button>
                </div>
                <button className="hamburger" onClick={() => setMenuOpen(true)} style={{
                    display: "none",
                    flexDirection: "column",
                    gap: 5,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4
                }}>
                    <span style={{display: "block", width: 24, height: 1.5, background: W}}/><span
                    style={{display: "block", width: 24, height: 1.5, background: W}}/><span
                    style={{display: "block", width: 18, height: 1.5, background: W}}/>
                </button>
            </nav>

            {/* HERO */}
            <section id="home" style={{
                position: "relative",
                height: "100vh",
                minHeight: 560,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                background: BG3,
                cursor: "grab"
            }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                <div className="hero-art" style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "52%",
                    height: "100%",
                    opacity: heroFade ? 1 : 0,
                    transition: "opacity .7s",
                    pointerEvents: "none"
                }}>
                    <img
                        src={cl(HERO_SLIDES[slide], 1600)}
                        alt="Inksomna"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            opacity: .8
                        }}
                    />
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to right,#080808 5%,transparent 100%)"
                    }}/>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top,#080808 0%,transparent 30%)"
                    }}/>
                </div>
                <div style={{position: "relative", zIndex: 2, padding: "0 24px 56px", maxWidth: 820}}
                     className="hero-pad">
                    <p className="fu" style={{
                        ...mono,
                        fontSize: 9,
                        letterSpacing: ".3em",
                        textTransform: "uppercase",
                        color: "#999",
                        marginBottom: 20
                    }}>Surrealism · Tattoo Art · {CITY}</p>
                    {/*<h1 className="fu1" style={{...serif,fontSize:"clamp(52px,10vw,148px)",fontWeight:300,lineHeight:.88,letterSpacing:"-.025em",color:W}}>Inksomna</h1>*/}
                    <div className="fu2"
                         style={{display: "flex", alignItems: "flex-start", gap: 16, margin: "28px 0 40px"}}>
                        <div style={{height: 1, width: 30, background: "#222", flexShrink: 0, marginTop: 9}}/>
                        <p style={{...mono, fontSize: 11, lineHeight: 1.95, color: "#888", maxWidth: 340}}>Where the
                            dreamlike becomes permanent on skin. Custom surrealism — no templates, no repetition, no
                            limits.</p>
                    </div>
                    <div className="fu3" style={{display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap"}}>
                        <button className="btn" onClick={() => scrollTo("booking")}>Book a Session</button>
                        <button className="nl" onClick={() => scrollTo("work")} style={{color: "#aaa"}}>See the Work ↓
                        </button>
                    </div>
                </div>
                <div style={{position: "absolute", bottom: 28, right: 24, display: "flex", gap: 8, zIndex: 5}}>
                    {HERO_SLIDES.map((_, i) => (<span key={i} onClick={() => {
                        setHeroFade(false);
                        setTimeout(() => {
                            setSlide(i);
                            setHeroFade(true);
                        }, 320);
                    }} style={{
                        width: i === slide ? 18 : 5,
                        height: 5,
                        borderRadius: 3,
                        background: i === slide ? "#fff" : "#2e2e2e",
                        cursor: "pointer",
                        transition: "width .35s,background .35s"
                    }}/>))}
                </div>
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    background: `linear-gradient(to bottom,transparent,${BG3})`,
                    pointerEvents: "none"
                }}/>
            </section>


            {/* PORTFOLIO */}
            <section id="work" style={{padding: "80px 0", background: BG2, borderTop: `1px solid ${BD}`}}>
                <div style={{padding: "0 24px", marginBottom: 48}}>
                    <SH label="Selected Works" title="The Portfolio"/>
                </div>
                {/* Portrait tiles — 3 columns, forced aspect ratio */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12,1fr)",
                    gridAutoRows: "55px",
                    gap: 3,
                    padding: "0 3px"
                }} className="port-creative">
                    {works.map((w, i) => {
                        const hasPhotos = w.photos.some(p => p);
                        /* All vertical — only column width varies, rows always tall */
                        const layouts = [
                            {col: "1 / 4", row: "1 / 10"},
                            {col: "4 / 7", row: "1 / 7"},
                            {col: "7 / 10", row: "1 / 8"},
                            {col: "10 / 13", row: "1 / 11"},
                            {col: "7 / 10", row: "8 / 14"},
                            {col: "4 / 7", row: "7 / 13"},
                        ];
                        const l = layouts[i] || layouts[0];
                        return (
                            <div key={w.id}
                                 onClick={() => {
                                     if (hasPhotos) {
                                         galleryFromGrid.current = false;
                                         overlayStack.current.push('gallery');
                                         history.pushState(null, '', '');
                                         setGallery({photos: w.photos, title: w.title, startIdx: 0});
                                     }
                                 }}
                                 style={{
                                     gridColumn: l.col,
                                     gridRow: l.row,
                                     position: "relative",
                                     overflow: "hidden",
                                     background: w.bg,
                                     cursor: hasPhotos ? "pointer" : "default"
                                 }}>
                                {w.cover
                                    ? <>
                                        <img src={cl(w.cover, 800)} alt={w.title} style={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            transition: "transform .7s cubic-bezier(.25,.46,.45,.94)"
                                        }} className="port-img"/>
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to top,rgba(8,8,8,.95) 0%,rgba(8,8,8,.5) 40%,rgba(8,8,8,.1) 70%,transparent 100%)",
                                            pointerEvents: "none",
                                            zIndex: 1
                                        }}/>
                                        <div style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to right,rgba(8,8,8,.6) 0%,transparent 55%)",
                                            pointerEvents: "none",
                                            zIndex: 1
                                        }}/>
                                    </>
                                    : <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>{arts[i % arts.length]}</div>
                                }
                                <div className="ov">
                                    <p style={{
                                        ...mono,
                                        fontSize: 8,
                                        letterSpacing: ".28em",
                                        textTransform: "uppercase",
                                        color: "#bbb"
                                    }}>Surrealism</p>
                                    <p style={{fontSize: "clamp(15px,2vw,22px)", fontWeight: 300}}>{w.title}</p>
                                </div>
                                <div className="bar"/>
                            </div>
                        );
                    })}
                </div>
                <div style={{display: "flex", justifyContent: "center", marginTop: 48, padding: "0 24px"}}>
                    <button className="btn" onClick={() => {
                        if (allWorks.length) {
                            document.body.dataset.mainScroll=String(window.scrollY);
                            overlayStack.current.push('grid');
                            history.pushState(null, '', '');
                            setPortGrid(true);
                            e.currentTarget.blur();
                        }
                    }}>View Full Portfolio
                    </button>
                </div>
            </section>

            {/* EVENTS & FESTIVALS — hidden, set to true to restore */}
            {false && (
                <section id="events" style={{background: BG3, borderTop: `1px solid ${BD}`}}>
                    <div style={{padding: "80px 32px 52px"}} className="section-pad">
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}
                             className="ev-head-inner">
                            <div>
                                <p style={{
                                    ...mono,
                                    fontSize: 9,
                                    letterSpacing: ".32em",
                                    textTransform: "uppercase",
                                    color: "#999",
                                    marginBottom: 14
                                }}>On the Road</p>
                                <h2 style={{
                                    ...serif,
                                    fontSize: "clamp(32px,5vw,64px)",
                                    fontWeight: 300,
                                    letterSpacing: "-.01em",
                                    lineHeight: 1
                                }}>Events & Festivals</h2>
                            </div>
                            <p style={{
                                ...mono,
                                fontSize: 9,
                                color: "#2a2a2a",
                                maxWidth: 200,
                                textAlign: "right",
                                lineHeight: 1.9
                            }}>Hover to browse · click videos to play · arrow keys to navigate.</p>
                        </div>
                    </div>
                    <div className="mosaic">
                        {events.map((ev, i) => (
                            <EventCard key={i} ev={ev} cardIndex={i}
                                       onVideoOpen={(src, label) => setVideo({src, label})}/>
                        ))}
                    </div>
                    <div style={{borderTop: `1px solid ${BD}`}}/>
                </section>
            )}


            {/* PROCESS VIDEO ─────────────────────────────────────────────
          Replace YOUR_VIDEO_ID with your YouTube video ID.
          For vertical video set aspect ratio to 9/16 on the video side.
      ─────────────────────────────────────────────────────────────*/}
            <section id="process" style={{background: BG3, borderTop: `1px solid ${BD}`}}>

                {/* ── DESKTOP: two columns ── */}
                <div className="proc-desktop"
                     style={{display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh"}}>
                    <div style={{
                        padding: "80px 48px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        <p style={{
                            ...mono,
                            fontSize: 9,
                            letterSpacing: ".32em",
                            textTransform: "uppercase",
                            color: "#666",
                            marginBottom: 20
                        }}>The Work</p>
                        <h2 style={{
                            ...serif,
                            fontSize: "clamp(32px,4vw,56px)",
                            fontWeight: 300,
                            lineHeight: 1.1,
                            marginBottom: 28
                        }}>How it<br/>gets done</h2>
                        <div style={{width: 24, height: 1, background: "#222", marginBottom: 28}}/>
                        <p style={{...mono, fontSize: 11, lineHeight: 2, color: "#888", maxWidth: 340}}>One session. The
                            sketch, the lines, the shading. Unedited.</p>
                    </div>
                    <div style={{
                        position: "relative",
                        background: "#050505",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <video
                            src="https://res.cloudinary.com/duv5eqvwu/video/upload/q_auto/v1777239921/MouthAndCandy_TikTok_giom7h.mp4"
                            autoPlay loop muted playsInline
                            style={{
                                position: "relative",
                                width: "auto",
                                height: "100%",
                                maxWidth: "100%",
                                maxHeight: "100vh",
                                objectFit: "contain",
                                display: "block"
                            }}/>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                            background: `linear-gradient(to bottom,${BG3},transparent)`,
                            pointerEvents: "none"
                        }}/>
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                            background: `linear-gradient(to top,${BG3},transparent)`,
                            pointerEvents: "none"
                        }}/>
                    </div>
                </div>

                {/* ── MOBILE: video full screen, text on top ── */}
                <div className="proc-mobile"
                     style={{position: "relative", minHeight: "100svh", overflow: "hidden", display: "none"}}>
                    <video
                        src="https://res.cloudinary.com/duv5eqvwu/video/upload/q_auto/v1777239921/MouthAndCandy_TikTok_giom7h.mp4"
                        autoPlay loop muted playsInline
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}/>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top,rgba(8,8,8,.95) 0%,rgba(8,8,8,.4) 50%,transparent 100%)",
                        zIndex: 1
                    }}/>
                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "48px 24px 60px",
                        zIndex: 2
                    }}>
                        <p style={{
                            ...mono,
                            fontSize: 9,
                            letterSpacing: ".32em",
                            textTransform: "uppercase",
                            color: "#888",
                            marginBottom: 16
                        }}>The Work</p>
                        <h2 style={{
                            ...serif,
                            fontSize: "clamp(32px,8vw,52px)",
                            fontWeight: 300,
                            lineHeight: 1.1,
                            marginBottom: 20
                        }}>How it<br/>gets done</h2>
                        <div style={{width: 24, height: 1, background: "#333", marginBottom: 20}}/>
                        <p style={{...mono, fontSize: 11, lineHeight: 1.9, color: "#aaa"}}>One session. The sketch, the
                            lines, the shading. Unedited.</p>
                    </div>
                </div>

            </section>

            {/* STATS

      <section ref={statsRef} style={{background:BG3,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)"}} className="stats-grid">
        {[[c1,"+","Years"],[c2,"+","Pieces"],[c3,"","Guest Spots"],["100","%","Custom"]].map(([n,s,l],i)=>(
          <div key={i} style={{padding:"44px 0",textAlign:"center",borderRight:i<3?`1px solid ${BD}`:"none"}}>
            <p style={{...serif,fontSize:"clamp(38px,5vw,80px)",fontWeight:300,color:W,lineHeight:1,letterSpacing:"-.02em"}}>{n}{s}</p>
            <p style={{...mono,fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"#555",marginTop:8}}>{l}</p>
          </div>
        ))}
      </section>

*/}

            {/* ABOUT */}
            <section id="about" style={{
                padding: "80px 24px",
                background: BG,
                borderTop: `1px solid ${BD}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 60,
                alignItems: "center"
            }} className="section-pad about-grid about-section">

                {/* Mobile/tablet bg — full bleed photo with overlay */}
                {ARTIST_PHOTO &&
                    <img src={cl(ARTIST_PHOTO, 800)} alt="Artist" className="about-img-bg" style={{display: "none"}}/>}
                <div className="about-overlay" style={{
                    display: "none",
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top,rgba(8,8,8,.98) 0%,rgba(8,8,8,.7) 50%,rgba(8,8,8,.2) 100%)",
                    zIndex: 1
                }}/>

                {/* Desktop photo column */}
                <div className="about-img" style={{position: "relative"}}>
                    <div style={{
                        width: "100%",
                        paddingBottom: "100%",
                        background: S1,
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        {ARTIST_PHOTO
                            ? <>
                                <img src={cl(ARTIST_PHOTO, 800)} alt="Artist" style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center top",
                                    display: "block"
                                }}/>
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    boxShadow: "inset 0 0 80px 40px #0e0e0e",
                                    pointerEvents: "none",
                                    zIndex: 1
                                }}/>
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "radial-gradient(ellipse at center, transparent 40%, rgba(14,14,14,.7) 75%, rgba(14,14,14,.97) 100%)",
                                    pointerEvents: "none",
                                    zIndex: 1
                                }}/>
                            </>
                            : <>
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: .3
                                }}>{arts[0]}</div>
                                <p style={{
                                    ...mono,
                                    position: "absolute",
                                    bottom: 16,
                                    left: 0,
                                    right: 0,
                                    textAlign: "center",
                                    fontSize: 8,
                                    letterSpacing: ".2em",
                                    textTransform: "uppercase",
                                    color: "#333"
                                }}>Artist Photo</p>
                            </>
                        }
                    </div>
                    <div style={{
                        position: "absolute",
                        top: -10,
                        left: -10,
                        right: 10,
                        bottom: 10,
                        border: "1px solid #1e1e1e",
                        zIndex: -1
                    }}/>
                </div>

                {/* Text column */}
                <div className="about-text" style={{minWidth: 0}}>
                    <p style={{
                        ...mono,
                        fontSize: 9,
                        letterSpacing: ".3em",
                        textTransform: "uppercase",
                        color: "#999",
                        marginBottom: 16
                    }}>About</p>
                    <h2 style={{
                        fontSize: "clamp(28px,4vw,52px)",
                        fontWeight: 300,
                        lineHeight: 1.08,
                        marginBottom: 8
                    }}>The Artist</h2>
                    <div style={{width: 26, height: 1, background: "#222", margin: "20px 0"}}/>
                    <p style={{...mono, fontSize: 11, lineHeight: 2, color: "#999", marginBottom: 16}}>
                        Since 2022, I have specialized in black and grey surrealism. My work is inspired by filmmakers such as David Lynch
                        and Alejandro Jodorowsky, as well as artists including Zdzisław Beksiński and Leonora Carrington.
                        I have participated in tattoo conventions in Poznań (2025), Wrocław Tattoo Show (2026),
                        and Ink & Lemon in Katowice (2026), where I received 3rd place in the Healed Small Black and Grey category.
                        Based in Wrocław, Poland.</p>
                    <p style={{...mono, fontSize: 11, lineHeight: 2, color: "#aaa", marginBottom: 40}}>One consultation.
                        One design. One tattoo made precisely for your body — never reproduced, never templated.</p>
                    <button className="btn" onClick={() => scrollTo("booking")}>Start a Conversation</button>
                </div>
            </section>

            {/* MARQUEE */}
            <div style={{
                borderTop: `1px solid ${BD}`,
                borderBottom: `1px solid ${BD}`,
                padding: "14px 0",
                overflow: "hidden",
                background: BG3
            }}>
                <div className="mq">
                    {Array(4).fill(["SURREALISM", "THE DREAM", "THE BODY", "THE DETAIL", "CUSTOM ONLY", CITY.toUpperCase(), "INKSOMNA", "ONE OF A KIND"]).flat().map((t, i) => (
                        <span key={i} style={{
                            ...mono,
                            fontSize: 10,
                            letterSpacing: ".28em",
                            textTransform: "uppercase",
                            color: i % 2 === 0 ? "#555" : "#777",
                            marginRight: 44
                        }}>{t}</span>
                    ))}
                </div>
            </div>

            {/* PROCESS */}
            <section style={{padding: "80px 24px", background: BG2, borderTop: `1px solid ${BD}`}}
                     className="section-pad">
                <SH label="How it works" title="The Process"/>
                <div style={{maxWidth: 760, margin: "0 auto"}}>
                    {processList.map((p, i) => (
                        <div key={i} style={{
                            borderTop: `1px solid ${BD}`,
                            padding: "28px 0",
                            display: "flex",
                            gap: 24,
                            alignItems: "flex-start"
                        }} className="process-step">
                            <span style={{
                                ...serif,
                                fontSize: 48,
                                fontWeight: 300,
                                color: "#444",
                                lineHeight: 1,
                                flexShrink: 0,
                                width: 72
                            }} className="process-num">{p.n}</span>
                            <div>
                                <h4 style={{
                                    fontSize: "clamp(18px,2.5vw,22px)",
                                    fontWeight: 300,
                                    marginBottom: 10
                                }}>{p.title}</h4>
                                <p style={{...mono, fontSize: 11, lineHeight: 1.9, color: "#999"}}>{p.body}</p>
                            </div>
                        </div>
                    ))}
                    <div style={{borderTop: `1px solid ${BD}`}}/>
                </div>
            </section>

            {/* TESTIMONIALS */}
            {/*<section style={{padding:"72px 24px",background:BG3,borderTop:`1px solid ${BD}`,textAlign:"center"}} className="section-pad">
        <p style={{...mono,fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#999",marginBottom:14}}>Client Words</p>
        <div style={{maxWidth:640,margin:"0 auto",minHeight:130,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <p style={{...serif,fontSize:"clamp(18px,3vw,34px)",fontWeight:300,lineHeight:1.5,color:W,marginBottom:22}}>"{testimonials[testIdx].quote}"</p>
          <p style={{...mono,fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"#999"}}> — {testimonials[testIdx].name}, {testimonials[testIdx].city}</p>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:30}}>
          {testimonials.map((_,i)=>(<span key={i} onClick={()=>setTestIdx(i)} style={{width:i===testIdx?18:5,height:5,borderRadius:3,background:i===testIdx?"#555":"#1e1e1e",cursor:"pointer",transition:"width .3s"}}/>))}
        </div>
      </section>*/}

            {/* FAQ */}
            <section id="faq" style={{padding: "80px 24px", background: BG, borderTop: `1px solid ${BD}`}}
                     className="section-pad">
                <SH label="We are here for you" title="FAQ"/>
                <div style={{maxWidth: 720, margin: "0 auto"}}>
                    {faqs.map((f, i) => (
                        <div key={i} style={{borderTop: `1px solid ${BD}`}}>
                            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                                width: "100%",
                                padding: "20px 0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: W,
                                textAlign: "left"
                            }}>
                                <span style={{...mono, fontSize: 11, color: "#888", paddingRight: 16}}>{f.q}</span>
                                <span style={{
                                    ...mono,
                                    fontSize: 16,
                                    color: faqOpen === i ? "#aaa" : "#444",
                                    transition: "transform .3s,color .3s",
                                    transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)",
                                    flexShrink: 0
                                }}>+</span>
                            </button>
                            <div style={{
                                maxHeight: faqOpen === i ? 200 : 0,
                                overflow: "hidden",
                                transition: "max-height .4s ease"
                            }}>
                                <p style={{
                                    ...mono,
                                    fontSize: 11,
                                    lineHeight: 1.9,
                                    color: "#aaa",
                                    paddingBottom: 20
                                }}>{f.a}</p>
                            </div>
                        </div>
                    ))}
                    <div style={{borderTop: `1px solid ${BD}`}}/>
                </div>
            </section>

            {/* BOOKING */}
            <section id="booking" style={{padding: "80px 24px", background: BG3, borderTop: `1px solid ${BD}`}}
                     className="section-pad">
                <SH label="We are here for you" title="Book Anytime"/>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.4fr",
                    gap: 72,
                    maxWidth: 980,
                    margin: "0 auto"
                }} className="booking-grid">
                    <div className="booking-info">
                        <div style={{marginTop: 28}}>
                            <p style={{
                                ...mono,
                                fontSize: 9,
                                letterSpacing: ".22em",
                                textTransform: "uppercase",
                                color: "#999",
                                marginBottom: 12
                            }}>Studio</p>
                            <p style={{...mono, fontSize: 11, lineHeight: 2, color: "#aaa"}}>Poland<br/>{CITY}<br/>Piłsudskiego
                            </p>
                        </div>
                        <div style={{marginTop: 20}}><p
                            style={{...mono, fontSize: 11, lineHeight: 2, color: "#aaa"}}>tago.tattoo.ask@gmail.com</p>
                        </div>
                        <div style={{marginTop: 32, padding: "16px 20px", border: `1px solid ${BD}`}}>
                            <p style={{
                                ...mono,
                                fontSize: 9,
                                letterSpacing: ".22em",
                                textTransform: "uppercase",
                                color: "#999",
                                marginBottom: 6
                            }}>Currently booking</p>
                            <p style={{...serif, fontSize: 26, fontWeight: 300, color: W}}>2–3 weeks out</p>
                        </div>
                    </div>
                    <div>
                        {sent ? (
                            <div style={{paddingTop: 40, textAlign: "center"}}>
                                <div style={{width: 32, height: 1, background: "#1e1e1e", margin: "0 auto 22px"}}/>
                                <h3 style={{fontSize: 30, fontWeight: 300, marginBottom: 12}}>Thank you.</h3>
                                <p style={{...mono, fontSize: 11, color: "#aaa", lineHeight: 1.9}}>Your message has been
                                    received.<br/>I'll be in touch within 48 hours.</p>
                            </div>
                        ) : (
                            <>
                                <p style={{
                                    ...mono,
                                    fontSize: 11,
                                    lineHeight: 1.95,
                                    color: "#aaa",
                                    marginBottom: 6
                                }}>Tell me about your idea — what you want, where you want it, how it should feel. I'll
                                    get back to you within 48 hours.</p>
                                <p style={{
                                    ...mono,
                                    fontSize: 11,
                                    color: "#888",
                                    marginBottom: 4
                                }}>tago.tattoo.ask@gmail.com</p>
                                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px"}}
                                     className="form-grid">
                                    <div><label className="fl">Name</label><input className="fi" type="text"
                                                                                  placeholder="Your name"
                                                                                  value={form.name}
                                                                                  onChange={e => setForm({
                                                                                      ...form,
                                                                                      name: e.target.value
                                                                                  })}/></div>
                                    <div><label className="fl">Email</label><input className="fi" type="email"
                                                                                   placeholder="your@email.com"
                                                                                   value={form.email}
                                                                                   onChange={e => setForm({
                                                                                       ...form,
                                                                                       email: e.target.value
                                                                                   })}/></div>
                                    <div style={{gridColumn: "1/-1"}}>
                                        <label className="fl">Your Vision</label>
                                        <textarea className="fi"
                                                  placeholder="Subject, size, placement, mood, references — tell me everything..."
                                                  value={form.message}
                                                  onChange={e => setForm({...form, message: e.target.value})}/>
                                    </div>
                                    <div style={{gridColumn: "1/-1", paddingTop: 24}}>
                                        <button className="btn" onClick={() => {
                                            if (form.name && form.email) setSent(true);
                                        }}>Send Message
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{borderTop: `1px solid ${BD}`, background: BG3}}>
                <div style={{padding: "44px 24px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32}}
                     className="footer-grid">
                    <div>
                        <p style={{
                            ...serif,
                            fontSize: 16,
                            fontWeight: 300,
                            letterSpacing: ".3em",
                            textTransform: "uppercase",
                            color: W,
                            marginBottom: 12
                        }}>Inksomna</p>
                        <div style={{display: "flex", gap: 12, marginTop: 22}}>
                            <button className="btn-sm" onClick={() => { overlayStack.current.push('ig'); history.pushState(null,'',''); setIgOpen(true); }}>Instagram</button>
                            <button className="btn-sm" onClick={() => scrollTo("booking")}>Contact</button>
                        </div>
                    </div>
                    <div>
                        <p style={{
                            ...mono,
                            fontSize: 9,
                            letterSpacing: ".2em",
                            textTransform: "uppercase",
                            color: "#777",
                            marginBottom: 16
                        }}>Navigation</p>
                        {["Work", "About", "FAQ", "Booking"].map(x => (
                            <p key={x} style={{marginBottom: 10}}>
                                <button className="nl" onClick={() => scrollTo(x.toLowerCase())}
                                        style={{color: "#888"}}>{x}</button>
                            </p>
                        ))}
                    </div>
                    <div>
                        <p style={{
                            ...mono,
                            fontSize: 9,
                            letterSpacing: ".2em",
                            textTransform: "uppercase",
                            color: "#777",
                            marginBottom: 16
                        }}>Studio</p>
                        <p style={{...mono, fontSize: 11, lineHeight: 2, color: "#888"}}>{CITY}<br/>Poland</p>
                    </div>
                </div>
                <div style={{
                    padding: "16px 24px",
                    borderTop: "1px solid #141414",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8
                }}>
                    <p style={{...mono, fontSize: 9, color: "#555"}}>© 2023 Inksomna · {CITY}</p>
                    <p style={{...mono, fontSize: 9, color: "#555"}}>inksomna.com</p>
                </div>
            </footer>

            {/* FLOATING INSTAGRAM BUTTON */}
            <div className="ig-btn" onClick={() => {
                overlayStack.current.push('ig');
                history.pushState(null, '', '');
                setIgOpen(true);
            }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"
                     strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4.5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="#aaa" stroke="none"/>
                </svg>
            </div>

            {/* INSTAGRAM OVERLAY */}
            <div className={`ig-ov${mounted?" ready":""}${igOpen?" open":""}`} onClick={e => {
                if (e.target === e.currentTarget) setIgOpen(false);
            }}>
                <div className="ig-frame"/>
                <div className="c-mark" style={{position: "absolute", top: 44, left: 44}}/>
                <div className="c-mark" style={{position: "absolute", top: 44, right: 44, transform: "scaleX(-1)"}}/>
                <div className="c-mark" style={{position: "absolute", bottom: 44, left: 44, transform: "scaleY(-1)"}}/>
                <div className="c-mark" style={{position: "absolute", bottom: 44, right: 44, transform: "scale(-1)"}}/>
                <button className="ig-close-btn" onClick={() => setIgOpen(false)}>Close ×</button>
                <div style={{textAlign: "center", padding: "0 32px"}}>
                    <p style={{
                        ...mono,
                        fontSize: 9,
                        letterSpacing: ".36em",
                        textTransform: "uppercase",
                        color: "#444",
                        marginBottom: 24
                    }}>Follow the Work</p>
                    <p className="ig-handle" style={{...serif}}>{IG_HANDLE}</p>
                    <div style={{
                        width: 1,
                        height: 36,
                        background: "linear-gradient(to bottom,transparent,#2a2a2a,transparent)",
                        margin: "0 auto 28px"
                    }}/>
                    <p className="ig-desc">Work in progress, healed pieces, convention updates, and guest spot
                        announcements.</p>
                    <a className="ig-cta" href={IG_URL} target="_blank" rel="noreferrer">Open Instagram</a>
                </div>
                <div className="ig-stats">
                    {[["500+", "Posts"], ["Daily", "Updates"], ["6–8×", "Guest Spots / yr"]].map(([n, l]) => (
                        <div key={l} style={{textAlign: "center"}}>
                            <p style={{...serif, fontSize: 28, fontWeight: 300, color: W, lineHeight: 1}}>{n}</p>
                            <p style={{
                                ...mono,
                                fontSize: 8,
                                letterSpacing: ".22em",
                                textTransform: "uppercase",
                                color: "#3a3a3a",
                                marginTop: 6
                            }}>{l}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* PORTFOLIO GRID */}
            {(portGrid || (gallery && gallery.fromGrid)) && (
                <PortfolioGrid
                    isHidden={!!(gallery && gallery.fromGrid)}
                    items={allWorks}
                    onClose={() => {
                        setPortGrid(false);
                        setGridScroll(0);
                    }}
                    savedScroll={gridScroll}
                    onScroll={setGridScroll}
                    onSelect={i => {
                        const item = allWorks[i];
                        const isGroup = typeof item === "object";
                        galleryFromGrid.current = true;
                        overlayStack.current.push('gallery');
                        history.pushState(null, '', '');
                        setGallery({
                            photos: isGroup ? item.photos : [item],
                            title: "",
                            startIdx: 0,
                            fromGrid: true,
                        });
                    }}
                />
            )}

            {/* VIDEO LIGHTBOX */}
            {video && <VideoLightbox src={video.src} label={video.label} onClose={() => setVideo(null)}/>}

            {/* GALLERY LIGHTBOX */}
            {gallery &&
                <GalleryLightbox photos={gallery.photos} title={gallery.title || ""} startIdx={gallery.startIdx || 0}
                                 onClose={() => setGallery(null)} onBack={gallery.fromGrid ? () => {
                    setGallery(null);
                    setPortGrid(true);
                } : null}/>}

        </div>
    );
}
