// src/pages/TrackCase.js
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { trackReport } from '../firebase/services';

const IcoSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoAlert  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IcoClip   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>;
const IcoCheck  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const STEPS=['pending','reviewing','investigating','resolved'];
const STEP_LBL=['Pending','Reviewing','Investigating','Resolved'];
const STATUS_MSG={
  pending:'Your report is queued for initial review by our team.',
  reviewing:'Our team is actively reviewing the details of your report.',
  investigating:'An investigator has been assigned and is actively working on your case.',
  escalated:'Your report has been escalated to senior authorities.',
  resolved:'This case has been resolved. Thank you for your courage in reporting.',
  dismissed:'Report reviewed and dismissed. Contact us if you have additional evidence.',
};

const fmt=(ts)=>{if(!ts)return'—';try{const d=ts.toDate?ts.toDate():new Date(ts);return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});}catch{return'—';}};

export default function TrackCase() {
  const [params]=useSearchParams();
  const [id,setId]=useState(params.get('id')||'');
  const [loading,setLoading]=useState(false);
  const [report,setReport]=useState(null);
  const [error,setError]=useState('');

  useEffect(()=>{if(params.get('id'))doTrack(params.get('id'));},[]);// eslint-disable-line

  const doTrack=async(trackId)=>{
    const q=(trackId||id).trim();
    if(!q){setError('Please enter a tracking ID.');return;}
    setLoading(true);setError('');setReport(null);
    try{
      const r=await trackReport(q);
      if(!r)setError('No report found with that tracking ID. Please check and try again.');
      else setReport(r);
    }catch{setError('Connection error. Please check your internet and try again.');}
    finally{setLoading(false);}
  };

  const stepIdx=report?STEPS.indexOf(report.status):-1;

  return (
    <div style={{background:'#f9fafb',minHeight:'calc(100vh - 68px)'}}>
      <div style={{maxWidth:660,margin:'0 auto',padding:'60px 24px 80px'}} className="fade-in">
        <h1 style={{fontSize:'2.2rem',fontWeight:800,letterSpacing:'-1px',marginBottom:10,textAlign:'center'}}>
          Track Your Report
        </h1>
        <p style={{color:'#6b7280',textAlign:'center',marginBottom:36,fontSize:'0.95rem'}}>
          Enter your tracking ID to view the status and progress of your case.
        </p>

        {/* Search */}
        <div style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:16,padding:'24px',boxShadow:'0 4px 16px rgba(0,0,0,0.06)',marginBottom:14}}>
          <label className="field-label" style={{display:'block',marginBottom:8}}>Tracking ID</label>
          <div style={{display:'flex',gap:10}}>
            <input className="field-input"
              value={id} onChange={e=>setId(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&doTrack()}
              placeholder="EXPS-XXXXXXXXXX-XXXXXXX"
              style={{fontFamily:'monospace',letterSpacing:'0.06em',flex:1,marginBottom:0}}/>
            <button onClick={()=>doTrack()} disabled={loading} style={{
              display:'flex',alignItems:'center',gap:7,
              padding:'0 20px',flexShrink:0,
              background:'linear-gradient(135deg,#0ea5e9,#ec4899)',
              color:'white',border:'none',borderRadius:10,
              fontSize:'0.88rem',fontWeight:700,
              cursor:loading?'not-allowed':'pointer',
              fontFamily:'Inter,sans-serif',
              boxShadow:'0 4px 12px rgba(14,165,233,0.3)',
              transition:'all 0.2s',
            }}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.opacity='0.92';e.currentTarget.style.transform='translateY(-1px)';}}}
            onMouseLeave={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.transform='translateY(0)';}}>
              {loading?<div className="spinner"/>:<IcoSearch/>}
              Track
            </button>
          </div>
          {error && (
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12,background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:8,padding:'10px 14px',fontSize:'0.82rem',color:'#b91c1c'}}>
              <IcoAlert/>{error}
            </div>
          )}
        </div>

        {/* Result */}
        {report && (
          <div style={{background:'white',border:'1.5px solid #bae6fd',borderRadius:16,padding:'24px',boxShadow:'0 4px 16px rgba(14,165,233,0.08)',marginBottom:14}} className="fade-in">
            <div style={{fontFamily:'monospace',fontSize:'0.82rem',color:'#0ea5e9',fontWeight:700,letterSpacing:'0.1em',marginBottom:6}}>{report.trackId}</div>
            <h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#111827',marginBottom:14}}>{report.title}</h2>

            <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:22}}>
              <span className={'badge badge-'+report.severity}>{report.severity}</span>
              <span className={'badge badge-'+report.status}>{(report.status||'').replace(/_/g,' ')}</span>
              {report.category && <span style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:20,padding:'3px 10px',fontSize:'0.72rem',color:'#6b7280'}}>{report.category.replace(/_/g,' ')}</span>}
              {report.location && <span style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:20,padding:'3px 10px',fontSize:'0.72rem',color:'#6b7280'}}>{report.location}</span>}
              <span style={{background:'#f9fafb',border:'1px solid #e5e7eb',borderRadius:20,padding:'3px 10px',fontSize:'0.72rem',color:'#6b7280'}}>{fmt(report.createdAt)}</span>
            </div>

            {/* Progress */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:'0.7rem',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>Case Progress</div>
              <div style={{display:'flex',gap:6}}>
                {STEPS.map((s,i)=>{
                  const done=i<=stepIdx,cur=i===stepIdx;
                  return (
                    <div key={s} style={{flex:1}}>
                      <div style={{height:5,borderRadius:3,marginBottom:7,background:done?'linear-gradient(90deg,#0ea5e9,#818cf8)':'#e5e7eb',boxShadow:cur?'0 0 8px rgba(14,165,233,0.4)':'none',transition:'background 0.4s'}}/>
                      <div style={{fontSize:'0.62rem',textAlign:'center',fontWeight:done?600:400,color:done?'#0ea5e9':'#9ca3af',display:'flex',alignItems:'center',justifyContent:'center',gap:2}}>
                        {done&&<IcoCheck/>}{STEP_LBL[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:10,padding:'12px 16px',fontSize:'0.85rem',color:'#0369a1',lineHeight:1.65}}>
              {STATUS_MSG[report.status]||STATUS_MSG.pending}
            </div>

            {report.evidence?.length>0 && (
              <div style={{marginTop:14}}>
                <div style={{fontSize:'0.72rem',color:'#6b7280',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>Evidence Files</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                  {report.evidence.map((e,i)=>(
                    <a key={i} href={e.url} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:5,background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:7,padding:'5px 12px',fontSize:'0.76rem',color:'#0369a1',fontWeight:500}}>
                      <IcoClip/>{e.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer card */}
        <div style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:14,padding:'20px 24px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
          <p style={{fontSize:'0.82rem',fontWeight:600,color:'#374151',marginBottom:6}}>Don't have a tracking ID?</p>
          <p style={{fontSize:'0.8rem',color:'#6b7280',marginBottom:14,lineHeight:1.6}}>Submit a report first to receive your unique tracking ID.</p>
          <Link to="/report" style={{
            display:'inline-flex',alignItems:'center',gap:6,
            padding:'9px 18px',background:'#0ea5e9',
            color:'white',borderRadius:9,fontSize:'0.82rem',fontWeight:700,
            boxShadow:'0 4px 12px rgba(14,165,233,0.25)',
          }}>Submit a Report</Link>
        </div>
      </div>
    </div>
  );
}
