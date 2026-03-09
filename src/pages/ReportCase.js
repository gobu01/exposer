// src/pages/ReportCase.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submitReport } from '../firebase/services';

const IcoShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoCheck  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoClip   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>;
const IcoLock   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcoX      = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoTrack  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

const CATEGORIES=[['bribery','Bribery & Kickbacks'],['fraud','Fraud & Embezzlement'],['abuse_of_power','Abuse of Power'],['nepotism','Nepotism & Favoritism'],['police_misconduct','Police Misconduct'],['government_corruption','Government Corruption'],['corporate_fraud','Corporate Fraud'],['electoral_fraud','Electoral Fraud'],['other','Other']];
const SEVERITIES=[{v:'low',label:'Low',dot:'#10b981'},{v:'medium',label:'Medium',dot:'#f59e0b'},{v:'high',label:'High',dot:'#ef4444'},{v:'critical',label:'Critical',dot:'#dc2626'}];

export default function ReportCase() {
  const [isAnon,     setIsAnon]     = useState(true);
  const [severity,   setSeverity]   = useState('medium');
  const [files,      setFiles]      = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress,   setProgress]   = useState('');
  const [done,       setDone]       = useState(null);
  const { register, handleSubmit, formState:{errors}, reset } = useForm();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize:52428800,
    onDrop:accepted=>setFiles(p=>[...p,...accepted]),
    onDropRejected:()=>toast.error('File too large (max 50 MB)'),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await submitReport({...data,severity,isAnonymous:isAnon},files,(idx,total,pct)=>setProgress(`Uploading file ${idx+1}/${total} — ${pct}%`));
      setDone(result); reset(); setFiles([]);
      toast.success('Report submitted!');
    } catch { toast.error('Submission failed — check your connection.'); }
    finally { setSubmitting(false); setProgress(''); }
  };

  /* SUCCESS */
  if (done) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:24,background:'#f9fafb'}} className="fade-in">
      <div style={{width:'100%',maxWidth:460,background:'white',borderRadius:20,border:'1.5px solid #e5e7eb',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.08)'}}>
        <div style={{background:'linear-gradient(135deg,#0ea5e9,#818cf8,#ec4899)',padding:'36px',textAlign:'center'}}>
          <div style={{width:64,height:64,borderRadius:16,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',color:'white'}}><IcoCheck/></div>
          <h2 style={{color:'white',fontSize:'1.5rem',fontWeight:800,marginBottom:6}}>Report Submitted!</h2>
          <p style={{color:'rgba(255,255,255,0.85)',fontSize:'0.85rem'}}>Securely received and logged</p>
        </div>
        <div style={{padding:'28px 32px 32px'}}>
          <p style={{fontSize:'0.85rem',color:'#6b7280',lineHeight:1.7,marginBottom:14,textAlign:'center'}}>Save your tracking ID to follow your case:</p>
          <div style={{background:'#f0f9ff',border:'1.5px solid #bae6fd',borderRadius:10,padding:'16px',fontFamily:'monospace',fontSize:'1.1rem',color:'#0ea5e9',textAlign:'center',letterSpacing:'0.1em',fontWeight:700,marginBottom:8,wordBreak:'break-all'}}>{done.trackId}</div>
          <p style={{fontSize:'0.75rem',color:'#9ca3af',textAlign:'center',marginBottom:24}}>No personal data was stored.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-ghost" style={{fontSize:'0.85rem'}} onClick={()=>setDone(null)}>Submit Another</button>
            <Link to={'/track?id='+done.trackId} className="btn btn-primary" style={{fontSize:'0.85rem',gap:6,background:'#0ea5e9',boxShadow:'0 4px 12px rgba(14,165,233,0.3)'}}>
              <IcoTrack/> Track Case
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  /* FORM */
  return (
    <div className="report-wrap fade-in" style={{background:'#f9fafb',minHeight:'calc(100vh - 68px)',padding:'48px 24px'}}>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <h1 style={{fontSize:'2rem',fontWeight:800,letterSpacing:'-0.5px',marginBottom:8}}>Report a Corruption Case</h1>
        <p style={{color:'#6b7280',marginBottom:28,lineHeight:1.6}}>Your identity is protected. All information is encrypted and handled confidentially.</p>

        <div className="report-card" style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:20,padding:'28px',boxShadow:'0 4px 16px rgba(0,0,0,0.06)'}}>
          {/* Anonymous toggle */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#f0f9ff',border:'1.5px solid #bae6fd',borderRadius:12,padding:'14px 18px',marginBottom:24}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{color:'#0ea5e9'}}><IcoShield/></span>
              <div>
                <strong style={{fontSize:'0.88rem',color:'#0369a1',display:'block'}}>Anonymous Mode {isAnon?'Enabled':'Disabled'}</strong>
                <span style={{fontSize:'0.75rem',color:'#9ca3af'}}>Your identity will NOT be stored or linked to this report</span>
              </div>
            </div>
            <div onClick={()=>setIsAnon(!isAnon)} style={{
              width:44,height:24,borderRadius:12,cursor:'pointer',position:'relative',flexShrink:0,
              background:isAnon?'#0ea5e9':'#d1d5db',transition:'background 0.2s',
            }}>
              <div style={{position:'absolute',width:18,height:18,background:'white',borderRadius:'50%',top:3,left:isAnon?23:3,transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}}/>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="field">
                <label className="field-label">Case Title *</label>
                <input className="field-input" {...register('title',{required:'Required'})} placeholder="Brief title of the incident"/>
                {errors.title && <span className="field-error">{errors.title.message}</span>}
              </div>
              <div className="field">
                <label className="field-label">Category *</label>
                <select className="field-input" {...register('category',{required:'Required'})} defaultValue="">
                  <option value="" disabled>Select category…</option>
                  {CATEGORIES.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
                {errors.category && <span className="field-error">{errors.category.message}</span>}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Description *</label>
              <textarea className="field-input" {...register('description',{required:'Required',minLength:{value:20,message:'At least 20 characters'}})}
                placeholder="Describe what happened — dates, locations, people involved…" style={{minHeight:110,resize:'vertical'}}/>
              {errors.description && <span className="field-error">{errors.description.message}</span>}
            </div>

            <div className="form-row-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="field">
                <label className="field-label">Location / Department</label>
                <input className="field-input" {...register('location')} placeholder="e.g. City Hall, Block B"/>
              </div>
              <div className="field">
                <label className="field-label">Date of Incident</label>
                <input className="field-input" type="date" {...register('incidentDate')}/>
              </div>
            </div>

            {/* Severity */}
            <div className="field" style={{marginBottom:20}}>
              <label className="field-label">Severity Level</label>
              <div style={{display:'flex',gap:8}}>
                {SEVERITIES.map(({v,label,dot})=>(
                  <button key={v} type="button" onClick={()=>setSeverity(v)} style={{
                    flex:1,padding:'9px',borderRadius:8,cursor:'pointer',
                    border:'1.5px solid '+(severity===v?dot:'#e5e7eb'),
                    background:severity===v?'#f9fafb':'white',
                    color:severity===v?'#111827':'#9ca3af',
                    fontFamily:'Inter,sans-serif',fontSize:'0.78rem',
                    fontWeight:severity===v?600:400,transition:'all 0.15s',
                    display:'flex',alignItems:'center',justifyContent:'center',gap:5,
                  }}>
                    <span style={{width:7,height:7,borderRadius:'50%',background:severity===v?dot:'#d1d5db',flexShrink:0,display:'inline-block'}}/>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* File upload */}
            <div className="field">
              <label className="field-label">Evidence Files (optional)</label>
              <div {...getRootProps()} style={{
                border:'2px dashed '+(isDragActive?'#0ea5e9':'#e5e7eb'),
                borderRadius:10,padding:'24px',textAlign:'center',cursor:'pointer',
                background:isDragActive?'#f0f9ff':'#fafafa',transition:'all 0.2s',
              }}>
                <input {...getInputProps()}/>
                <div style={{display:'flex',justifyContent:'center',marginBottom:8}}><IcoClip/></div>
                <p style={{fontSize:'0.82rem',color:'#9ca3af'}}><span style={{color:'#0ea5e9',fontWeight:600}}>Click to upload</span> or drag & drop</p>
                <p style={{fontSize:'0.72rem',color:'#d1d5db',marginTop:4}}>PDF, DOC, JPG, PNG, MP4 — max 50 MB</p>
              </div>
              {files.length>0 && (
                <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:6}}>
                  {files.map((f,i)=>(
                    <span key={i} style={{display:'inline-flex',alignItems:'center',gap:5,background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:20,padding:'3px 10px',fontSize:'0.75rem',color:'#0369a1'}}>
                      {f.name}
                      <span onClick={()=>setFiles(files.filter((_,j)=>j!==i))} style={{cursor:'pointer',color:'#ef4444',display:'flex'}}><IcoX/></span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="field">
              <label className="field-label">Contact Email <span style={{fontWeight:400,color:'#9ca3af'}}>(optional — for updates only)</span></label>
              <input className="field-input" type="email" {...register('reporterEmail')} placeholder="Leave blank to stay fully anonymous"/>
            </div>

            {progress && (
              <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:8,padding:'10px 14px',fontSize:'0.82rem',color:'#0369a1',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
                <div className="spinner spinner-blue"/>{progress}
              </div>
            )}

            <button type="submit" disabled={submitting} style={{
              width:'100%',padding:'14px',
              background:'linear-gradient(135deg,#0ea5e9,#ec4899)',
              color:'white',border:'none',borderRadius:12,
              fontSize:'1rem',fontWeight:700,cursor:submitting?'not-allowed':'pointer',
              fontFamily:'Inter,sans-serif',transition:'all 0.2s',
              boxShadow:'0 6px 20px rgba(14,165,233,0.3)',
              marginTop:8,opacity:submitting?0.7:1,
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            }}>
              {submitting ? <><div className="spinner"/>Submitting securely…</> : <><IcoLock/> Submit Report Securely</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
