// src/pages/Dashboard.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToReports, updateReportStatus } from '../firebase/services';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';

const IcoRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>;
const IcoPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoFile   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoSearch = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoCheck  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoClock  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoEye    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

const STATUS_COLORS={pending:'#fbbf24',reviewing:'#60a5fa',investigating:'#a78bfa',escalated:'#f87171',resolved:'#34d399',dismissed:'#94a3b8'};
const SEV_COLORS={low:'#34d399',medium:'#fbbf24',high:'#f87171',critical:'#f43f5e'};
const STATUSES=['all','pending','reviewing','investigating','escalated','resolved','dismissed'];

const fmt=(ts)=>{if(!ts)return'—';try{const d=ts.toDate?ts.toDate():new Date(ts);return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});}catch{return'—';}};

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [reports,  setReports]  = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState('');

  useEffect(()=>{ const unsub=subscribeToReports(data=>{setReports(data);setLoading(false);}); return unsub; },[]);

  const handleStatusChange=async(reportId,newStatus)=>{
    setUpdating(reportId);
    try{await updateReportStatus(reportId,newStatus,profile?.uid);toast.success('Status updated');}
    catch{toast.error('Failed to update');}
    finally{setUpdating('');}
  };

  const filtered=reports.filter(r=>{
    const matchStatus=filter==='all'||r.status===filter;
    const matchSearch=!search||r.title?.toLowerCase().includes(search.toLowerCase())||r.trackId?.toLowerCase().includes(search.toLowerCase());
    return matchStatus&&matchSearch;
  });

  const total=reports.length;
  const investigating=reports.filter(r=>r.status==='investigating').length;
  const resolved=reports.filter(r=>r.status==='resolved').length;
  const pending=reports.filter(r=>r.status==='pending'||r.status==='reviewing').length;

  const statusData=Object.entries(reports.reduce((a,r)=>({...a,[r.status]:(a[r.status]||0)+1}),{})).map(([name,value])=>({name,value}));
  const sevData=['critical','high','medium','low'].map(s=>({name:s,value:reports.filter(r=>r.severity===s).length})).filter(d=>d.value>0);

  const STAT_CARDS=[
    {Icon:IcoFile,   val:total,         color:'#0ea5e9', bg:'#f0f9ff', label:'Total Reports' },
    {Icon:IcoSearch, val:investigating, color:'#8b5cf6', bg:'#ede9fe', label:'Investigating'  },
    {Icon:IcoCheck,  val:resolved,      color:'#10b981', bg:'#dcfce7', label:'Resolved'       },
    {Icon:IcoClock,  val:pending,       color:'#f59e0b', bg:'#fef9c3', label:'Pending Review' },
  ];

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <div style={{textAlign:'center'}}><div className="spinner spinner-blue" style={{width:36,height:36,borderWidth:3,margin:'0 auto 14px'}}/><p style={{color:'#9ca3af',fontSize:'0.85rem'}}>Loading reports…</p></div>
    </div>
  );

  return (
    <div style={{background:'#f9fafb',minHeight:'calc(100vh - 68px)',padding:'32px 40px 48px'}} className="fade-in">
      <div style={{maxWidth:1200,margin:'0 auto'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:14}}>
          <div>
            <h1 style={{fontSize:'1.8rem',fontWeight:800,letterSpacing:'-0.5px',marginBottom:4}}>Admin Dashboard</h1>
            <p style={{color:'#6b7280',fontSize:'0.85rem'}}>Real-time case management · {profile?.name}</p>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-ghost" style={{fontSize:'0.85rem',padding:'9px 16px',gap:6}} onClick={()=>{}}>
              <IcoRefresh/> Refresh
            </button>
            <button className="btn btn-primary" style={{fontSize:'0.85rem',padding:'9px 16px',gap:6}} onClick={()=>navigate('/report')}>
              <IcoPlus/> New Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
          {STAT_CARDS.map(({Icon,val,color,bg,label})=>(
            <div key={label} style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:14,padding:'20px 22px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{width:40,height:40,borderRadius:10,background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}><Icon/></div>
              <div style={{fontSize:'1.9rem',fontWeight:800,color,lineHeight:1,marginBottom:4}}>{val}</div>
              <div style={{fontSize:'0.78rem',color:'#9ca3af',fontWeight:500}}>{label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {reports.length>0 && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
            <div style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:14,padding:'20px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <p style={{fontWeight:700,fontSize:'0.88rem',marginBottom:14,color:'#111827'}}>Reports by Status</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={statusData} margin={{top:0,right:0,bottom:0,left:-20}}>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{fontSize:'0.78rem',borderRadius:8,border:'1px solid #e5e7eb'}}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>{statusData.map((e,i)=><Cell key={i} fill={STATUS_COLORS[e.name]||'#60a5fa'}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:14,padding:'20px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <p style={{fontWeight:700,fontSize:'0.88rem',marginBottom:14,color:'#111827'}}>Severity Breakdown</p>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={sevData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                    {sevData.map((e,i)=><Cell key={i} fill={SEV_COLORS[e.name]||'#60a5fa'}/>)}
                  </Pie>
                  <Tooltip contentStyle={{fontSize:'0.78rem',borderRadius:8,border:'1px solid #e5e7eb'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{background:'white',border:'1.5px solid #e5e7eb',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid #f3f4f6',flexWrap:'wrap',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
              <span style={{fontWeight:700,fontSize:'0.92rem',marginRight:4}}>All Reports</span>
              {STATUSES.map(s=>(
                <button key={s} onClick={()=>setFilter(s)} style={{
                  padding:'4px 12px',borderRadius:20,
                  border:'1.5px solid '+(filter===s?'#0ea5e9':'#e5e7eb'),
                  background:filter===s?'#f0f9ff':'transparent',
                  color:filter===s?'#0ea5e9':'#6b7280',
                  fontSize:'0.72rem',fontFamily:'Inter,sans-serif',
                  fontWeight:filter===s?600:400,cursor:'pointer',
                  textTransform:'capitalize',transition:'all 0.12s',
                }}>{s}</button>
              ))}
            </div>
            <input className="field-input"
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search reports…"
              style={{maxWidth:200,fontSize:'0.82rem',padding:'8px 12px',marginBottom:0}}/>
          </div>

          {filtered.length===0 ? (
            <div style={{padding:'48px',textAlign:'center',color:'#9ca3af',fontSize:'0.88rem'}}>
              {reports.length===0?'No reports yet. Submit the first one!':'No reports match your filter.'}
            </div>
          ) : (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr>{['Tracking ID','Title','Category','Severity','Status','Filed','Actions'].map(h=>(
                    <th key={h} style={{padding:'11px 20px',textAlign:'left',fontSize:'0.72rem',color:'#9ca3af',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',background:'#fafafa',borderBottom:'1px solid #f3f4f6'}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(r=>(
                    <tr key={r.id} style={{borderBottom:'1px solid #f9fafb',transition:'background 0.12s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e=>e.currentTarget.style.background='white'}>
                      <td style={{padding:'13px 20px',fontFamily:'monospace',color:'#0ea5e9',fontSize:'0.8rem',fontWeight:700}}>{r.trackId}</td>
                      <td style={{padding:'13px 20px',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.85rem',fontWeight:500,color:'#111827'}}>{r.title}</td>
                      <td style={{padding:'13px 20px',fontSize:'0.78rem',color:'#6b7280',textTransform:'capitalize'}}>{(r.category||'').replace(/_/g,' ')}</td>
                      <td style={{padding:'13px 20px'}}><span className={'badge badge-'+r.severity}>{r.severity}</span></td>
                      <td style={{padding:'13px 20px'}}><span className={'badge badge-'+r.status}>{(r.status||'').replace(/_/g,' ')}</span></td>
                      <td style={{padding:'13px 20px',fontSize:'0.78rem',color:'#9ca3af'}}>{fmt(r.createdAt)}</td>
                      <td style={{padding:'13px 20px'}}>
                        <div style={{display:'flex',gap:6,alignItems:'center'}}>
                          <select onChange={e=>{if(e.target.value)handleStatusChange(r.id,e.target.value);e.target.value='';}}
                            disabled={updating===r.id} defaultValue=""
                            style={{padding:'5px 8px',border:'1.5px solid #e5e7eb',borderRadius:6,fontSize:'0.75rem',fontFamily:'Inter,sans-serif',color:'#374151',cursor:'pointer',outline:'none',background:'white'}}>
                            <option value="" disabled>Change…</option>
                            {['pending','reviewing','investigating','escalated','resolved','dismissed'].map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                          {updating===r.id && <div className="spinner spinner-blue" style={{width:13,height:13}}/>}
                          <button onClick={()=>navigate('/report/'+r.id)} style={{
                            display:'flex',alignItems:'center',gap:4,
                            padding:'5px 10px',background:'#f0f9ff',
                            border:'1.5px solid #bae6fd',borderRadius:6,
                            fontSize:'0.75rem',color:'#0369a1',cursor:'pointer',
                            fontFamily:'Inter,sans-serif',fontWeight:500,
                          }}>
                            <IcoEye/> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{padding:'12px 24px',borderTop:'1px solid #f9fafb',fontSize:'0.75rem',color:'#9ca3af',display:'flex',justifyContent:'space-between'}}>
            <span>Showing {filtered.length} of {reports.length} reports</span>
            <span>Live updates via Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
