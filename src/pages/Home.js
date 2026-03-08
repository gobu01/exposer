// src/pages/Home.js
import { Link } from 'react-router-dom';

const IcoShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoLock   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcoPin    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoClip   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>;
const IcoZap    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoScale  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3"/><path d="M3 6l6 6-6 6"/><path d="M21 6l-6 6 6 6"/></svg>;
const IcoStar   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#0ea5e9"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const FEATURES = [
  { Icon:IcoShield, colorClass:'icon-blue',   title:'100% Anonymous',       desc:'Your identity is never stored. No IP logging. Submit reports completely anonymously with zero trace.' },
  { Icon:IcoLock,   colorClass:'icon-pink',   title:'End-to-End Encrypted', desc:'All reports and evidence files are encrypted in transit and at rest using Firebase Security Rules.' },
  { Icon:IcoPin,    colorClass:'icon-green',  title:'Live Case Tracking',   desc:"Track your report's progress in real time using your unique tracking ID — no account needed." },
  { Icon:IcoClip,   colorClass:'icon-purple', title:'Evidence Upload',       desc:'Attach photos, videos, documents, and audio recordings to support your corruption report.' },
  { Icon:IcoZap,    colorClass:'icon-orange', title:'24/7 Availability',     desc:'Submit reports anytime, anywhere. Our platform is always online and ready to receive your case.' },
  { Icon:IcoScale,  colorClass:'icon-red',    title:'Legal Protection',      desc:'Aligned with Whistle Blowers Protection Act, 2014 and international anti-corruption standards.' },
];

const COLOR_MAP = {
  'icon-blue':   { bg:'#e0f2fe', color:'#0369a1' },
  'icon-pink':   { bg:'#fce7f3', color:'#9d174d' },
  'icon-green':  { bg:'#dcfce7', color:'#166534' },
  'icon-purple': { bg:'#ede9fe', color:'#5b21b6' },
  'icon-orange': { bg:'#fff7ed', color:'#9a3412' },
  'icon-red':    { bg:'#fef2f2', color:'#991b1b' },
};

export default function Home() {
  return (
    <div className="fade-in">
      {/* ── HERO ─────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #f3f4f6' }}>
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center',
          textAlign:'center', padding:'80px 24px 70px',
          maxWidth:900, margin:'0 auto',
        }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'8px 18px', background:'#f0f9ff',
            border:'1.5px solid #bae6fd', borderRadius:20,
            fontSize:'0.85rem', fontWeight:500, color:'#0369a1', marginBottom:32,
          }}>
            <IcoStar /> Fighting Corruption Together
          </div>

          <h1 style={{
            fontSize:'5rem', fontWeight:900, lineHeight:1.0,
            letterSpacing:'-2px', marginBottom:28,
          }}>
            <span style={{color:'#0ea5e9'}}>Expose </span>
            <span style={{background:'linear-gradient(90deg,#818cf8,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Corruption</span>
            <br/>
            <span style={{color:'#111827'}}>Protect Democracy</span>
          </h1>

          <p style={{fontSize:'1.15rem',color:'#6b7280',maxWidth:560,lineHeight:1.75,marginBottom:40}}>
            A secure, anonymous platform where citizens report corruption, provide evidence,
            and track accountability. Together, we build a transparent and fair society.
          </p>

          <div style={{display:'flex',gap:14,marginBottom:64}}>
            <Link to="/report" style={{
              padding:'16px 36px',
              background:'linear-gradient(135deg,#0ea5e9,#ec4899)',
              color:'white', borderRadius:12, fontSize:'1rem', fontWeight:700,
              boxShadow:'0 6px 20px rgba(14,165,233,0.3)', transition:'all 0.2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.opacity='0.92';e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.transform='translateY(0)';}}>
              Report a Case
            </Link>
            <Link to="/about" style={{
              padding:'16px 36px',
              background:'white', color:'#374151',
              border:'1.5px solid #e5e7eb', borderRadius:12,
              fontSize:'1rem', fontWeight:600, transition:'all 0.15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#0ea5e9';e.currentTarget.style.color='#0ea5e9';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#374151';}}>
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div style={{display:'flex',gap:0,borderRadius:16,overflow:'hidden',border:'1px solid #e5e7eb',boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
            {[['100%','Anonymous','#0ea5e9'],['24/7','Availability','#ec4899'],['Secure','Encrypted','#818cf8']].map(([n,l,c],i)=>(
              <div key={l} style={{padding:'20px 48px',textAlign:'center',background:'white',borderRight:i<2?'1px solid #f3f4f6':'none'}}>
                <div style={{fontSize:'2rem',fontWeight:900,color:c,letterSpacing:'-1px'}}>{n}</div>
                <div style={{fontSize:'0.78rem',color:'#9ca3af',marginTop:4,fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────── */}
      <div style={{height:1,background:'linear-gradient(90deg,transparent,#e5e7eb,transparent)',margin:'0'}}/>

      {/* ── FEATURES ─────────────────────────────── */}
      <div style={{padding:'64px 40px',maxWidth:1100,margin:'0 auto'}}>
        <h2 style={{fontSize:'2.2rem',fontWeight:800,letterSpacing:'-1px',textAlign:'center',marginBottom:10}}>
          Why Choose <span style={{color:'#0ea5e9'}}>EXPOSER</span>?
        </h2>
        <p style={{textAlign:'center',color:'#6b7280',marginBottom:40,fontSize:'1rem'}}>
          Everything you need to fight corruption — safely and effectively.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {FEATURES.map(({Icon,colorClass,title,desc})=>{
            const {bg,color}=COLOR_MAP[colorClass];
            return (
              <div key={title} style={{
                background:'white',border:'1.5px solid #f3f4f6',borderRadius:16,
                padding:'28px',transition:'all 0.2s',cursor:'default',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor='#e5e7eb';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='#f3f4f6';}}>
                <div style={{
                  width:48,height:48,borderRadius:12,background:bg,color,
                  display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,
                }}>
                  <Icon/>
                </div>
                <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:8,color:'#111827'}}>{title}</h3>
                <p style={{fontSize:'0.85rem',color:'#6b7280',lineHeight:1.7}}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
