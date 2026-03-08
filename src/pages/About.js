// src/pages/About.js
import { Link } from 'react-router-dom';

const IcoTarget  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IcoScale   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3"/><path d="M3 6l6 6-6 6"/><path d="M21 6l-6 6 6 6"/></svg>;
const IcoZap     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoBook    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const IcoPhone   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 12 19.79 19.79 0 01.87 3.4 2 2 0 012.85 1.22h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 9c1.51 2.58 3.76 4.84 6.32 6.32l1.13-1.13a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>;

const CARDS=[
  {Icon:IcoTarget,color:'#0ea5e9',bg:'#e0f2fe',title:'Our Mission',        desc:"To empower every citizen to fight corruption safely and anonymously, ensuring no act of misconduct goes unreported due to fear of retaliation."},
  {Icon:IcoScale, color:'#ec4899',bg:'#fce7f3',title:'Legal Framework',    desc:"Built in alignment with India's Whistle Blowers Protection Act 2014, Prevention of Corruption Act 1988, and the UN Convention Against Corruption."},
  {Icon:IcoZap,   color:'#10b981',bg:'#dcfce7',title:'Powered by Firebase',desc:"Real-time database, anonymous submissions, encrypted file storage, and role-based access control on Google's Firebase platform."},
  {Icon:IcoBook,  color:'#818cf8',bg:'#ede9fe',title:'College Project',    desc:"This portal is built as a college study project demonstrating full-stack web development with Firebase, React, and modern security practices."},
];

const STACK=['React 18','Firebase Auth','Cloud Firestore','Firebase Storage','React Router v6','React Hook Form','Recharts','React Dropzone','React Toastify'];

export default function About() {
  return (
    <div style={{background:'#f9fafb',minHeight:'calc(100vh - 68px)'}} className="fade-in">
      <div style={{maxWidth:900,margin:'0 auto',padding:'56px 40px 72px'}}>
        <h1 style={{fontSize:'2.4rem',fontWeight:800,letterSpacing:'-1px',marginBottom:12}}>
          About <span style={{color:'#0ea5e9'}}>EXPOSER</span>
        </h1>
        <p style={{color:'#6b7280',lineHeight:1.75,maxWidth:580,marginBottom:44,fontSize:'1rem'}}>
          A secure, anonymous platform where citizens can report corruption, provide evidence,
          and track accountability. We believe transparency is the foundation of a fair society.
        </p>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:28}}>
          {CARDS.map(({Icon,color,bg,title,desc})=>(
            <div key={title} style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:16,padding:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{width:48,height:48,borderRadius:12,background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}><Icon/></div>
              <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:8,color:'#111827'}}>{title}</h3>
              <p style={{fontSize:'0.85rem',color:'#6b7280',lineHeight:1.7}}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:16,padding:'24px',marginBottom:20,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:14,color:'#111827'}}>Tech Stack</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {STACK.map(t=>(
              <span key={t} style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:20,padding:'4px 14px',fontSize:'0.8rem',color:'#0369a1',fontWeight:500}}>{t}</span>
            ))}
          </div>
        </div>

        {/* Hotline */}
        <div style={{
          background:'linear-gradient(135deg,#0ea5e9,#818cf8,#ec4899)',
          borderRadius:20,padding:'28px 32px',
          display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:52,height:52,borderRadius:14,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',flexShrink:0}}>
              <IcoPhone/>
            </div>
            <div>
              <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.8)',marginBottom:4}}>Emergency Hotline</div>
              <div style={{fontSize:'2rem',fontWeight:900,color:'white',lineHeight:1}}>1800-XXX-XXXX</div>
              <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.7)',marginTop:4}}>24/7 · All calls are confidential</div>
            </div>
          </div>
          <Link to="/report" style={{
            padding:'12px 24px',background:'white',color:'#0ea5e9',
            borderRadius:10,fontWeight:700,fontSize:'0.92rem',
            boxShadow:'0 4px 14px rgba(0,0,0,0.1)',transition:'all 0.2s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}}>
            Submit a Report
          </Link>
        </div>
      </div>
    </div>
  );
}
