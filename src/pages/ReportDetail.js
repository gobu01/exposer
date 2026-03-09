// src/pages/ReportDetail.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReport, updateReportStatus, addComment } from '../firebase/services';
import { toast } from 'react-toastify';

const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IcoClip = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
  </svg>
);

const IcoAlertTri = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IcoCheckSm = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IcoPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const STATUS_OPTS = ['pending', 'reviewing', 'investigating', 'escalated', 'resolved', 'dismissed'];

const fmt = (ts) => {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-IN');
  } catch {
    return '—';
  }
};

export default function ReportDetail() {
  const { id }       = useParams();
  const { profile }  = useAuth();
  const navigate     = useNavigate();
  const [report,     setReport]   = useState(null);
  const [loading,    setLoading]  = useState(true);
  const [error,      setError]    = useState('');
  const [comment,    setComment]  = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [posting,    setPosting]  = useState(false);
  const [updating,   setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await getReport(id);
      if (!r) setError('Report not found.');
      else setReport(r);
    } catch (err) {
      setError('Failed to load: ' + (err.message || 'Unknown error') + '. Check your Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line

  const handleStatus = async (status) => {
    if (updating || report.status === status) return;
    setUpdating(true);
    try {
      await updateReportStatus(id, status, profile?.uid);
      toast.success('Status updated to ' + status);
      setReport(r => ({ ...r, status }));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || posting) return;
    setPosting(true);
    try {
      await addComment(id, profile?.uid, profile?.name || 'Staff', comment.trim(), isInternal);
      toast.success('Note added');
      setComment('');
      await load();
    } catch {
      toast.error('Failed to add note');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-blue" style={{ width: 36, height: 36, borderWidth: 3, margin: '0 auto 14px' }} />
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Loading report…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 540, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#ef4444' }}>
          <IcoAlertTri />
        </div>
        <h2 style={{ fontWeight: 800, marginBottom: 10, fontSize: '1.3rem' }}>Could Not Load Report</h2>
        <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, padding: '12px 16px', fontSize: '0.8rem', color: '#b91c1c', marginBottom: 18, textAlign: 'left', fontFamily: 'monospace', lineHeight: 1.7 }}>
          {error}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ background: '#0ea5e9', boxShadow: '0 4px 12px rgba(14,165,233,0.3)', fontSize: '0.85rem' }} onClick={load}>
            Retry
          </button>
          <button className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <h2>Report Not Found</h2>
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="detail-wrap fade-in" style={{ background: '#f9fafb', minHeight: 'calc(100vh - 68px)', padding: '32px 40px 60px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <button
          className="btn btn-ghost"
          style={{ marginBottom: 20, fontSize: '0.82rem', padding: '8px 14px', gap: 6 }}
          onClick={() => navigate('/dashboard')}
        >
          <IcoArrow /> Dashboard
        </button>

        {/* Title row */}
        <div className="detail-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#0ea5e9', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
              {report.trackId}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#111827' }}>{report.title}</h1>
          </div>
          <div className="detail-badges" style={{ display: 'flex', gap: 7 }}>
            <span className={'badge badge-' + report.severity} style={{ padding: '5px 12px', fontSize: '0.76rem' }}>{report.severity}</span>
            <span className={'badge badge-' + report.status} style={{ padding: '5px 12px', fontSize: '0.76rem' }}>{(report.status || '').replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* 2-col grid */}
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 18, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Description */}
            <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>Description</h3>
              <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{report.description}</p>
            </div>

            {/* Evidence */}
            {report.evidence?.length > 0 && (
              <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                  Evidence ({report.evidence.length})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {report.evidence.map((e, i) => (
                    <a key={i} href={e.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', color: '#0369a1', fontWeight: 500 }}>
                      <IcoClip /> {e.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: 14 }}>
                Investigation Notes ({(report.comments || []).length})
              </h3>

              {(report.comments || []).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  {report.comments.map(c => (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: c.isInternal ? '#fefce8' : '#f9fafb',
                        border: '1.5px solid ' + (c.isInternal ? '#fde047' : '#e5e7eb'),
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, flexWrap: 'wrap', gap: 5 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>{c.userName || 'Staff'}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {c.isInternal && (
                            <span style={{ fontSize: '0.65rem', background: '#fef9c3', color: '#854d0e', padding: '2px 7px', borderRadius: 10, fontWeight: 600 }}>
                              Internal
                            </span>
                          )}
                          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{fmt(c.createdAt)}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.65 }}>{c.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: 16, fontStyle: 'italic' }}>No notes yet.</p>
              )}

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
                <textarea
                  className="field-input"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add an investigation note…"
                  style={{ minHeight: 80, marginBottom: 10, resize: 'vertical' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '0.82rem', color: '#374151' }}>
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={e => setIsInternal(e.target.checked)}
                      style={{ width: 15, height: 15, accentColor: '#f59e0b' }}
                    />
                    Internal only
                  </label>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', gap: 5, background: '#0ea5e9', boxShadow: '0 4px 12px rgba(14,165,233,0.25)' }}
                    onClick={handleComment}
                    disabled={posting || !comment.trim()}
                  >
                    {posting ? <><div className="spinner" />Posting…</> : <><IcoPlus />Add Note</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Status update */}
            <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>Update Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {STATUS_OPTS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatus(s)}
                    disabled={report.status === s || updating}
                    style={{
                      padding: '9px 12px', borderRadius: 8,
                      cursor: (report.status === s || updating) ? 'default' : 'pointer',
                      border: '1.5px solid ' + (report.status === s ? '#0ea5e9' : '#e5e7eb'),
                      background: report.status === s ? '#f0f9ff' : 'white',
                      color: report.status === s ? '#0ea5e9' : '#374151',
                      fontFamily: 'Inter,sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: report.status === s ? 600 : 400,
                      textAlign: 'left',
                      textTransform: 'capitalize',
                      transition: 'all 0.12s',
                      opacity: (updating && report.status !== s) ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    {report.status === s && (
                      <span style={{ color: '#0ea5e9', flexShrink: 0 }}><IcoCheckSm /></span>
                    )}
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              {updating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, fontSize: '0.75rem', color: '#9ca3af' }}>
                  <div className="spinner spinner-blue" style={{ width: 13, height: 13 }} />
                  Updating…
                </div>
              )}
            </div>

            {/* Report info */}
            <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>Report Info</h3>
              {[
                ['Category', (report.category || '').replace(/_/g, ' ')],
                ['Severity',  report.severity],
                ['Location',  report.location || '—'],
                ['Incident',  report.incidentDate || '—'],
                ['Filed',     fmt(report.createdAt)],
                ['Updated',   fmt(report.updatedAt)],
                ['Anonymous', report.isAnonymous ? 'Yes' : 'No'],
                ['Email',     report.reporterEmail || 'Hidden'],
                ['Assigned',  report.assignedTo || 'Unassigned'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f9fafb', gap: 8 }}>
                  <span style={{ fontSize: '0.73rem', color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: '0.73rem', color: '#374151', fontWeight: 500, textAlign: 'right', textTransform: 'capitalize', wordBreak: 'break-word', maxWidth: '60%' }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}