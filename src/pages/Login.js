import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const IcoShield = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoAlert  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [error,   setError]   = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      const { profile } = await login(email, pass);
      if (!profile) throw new Error('no-profile');
      toast.success('Welcome back, ' + profile.name + '!');
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'no-profile') setError('Account found but no admin profile. Contact your administrator.');
      else if (['auth/user-not-found','auth/wrong-password','auth/invalid-credential'].includes(err.code)) setError('Invalid email or password.');
      else setError('Login failed. Check your connection and try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrap fade-in" style={{
      minHeight:'calc(100vh - 68px)', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'#f9fafb', padding:24,
    }}>
      <div style={{width:'100%',maxWidth:420}}>
        <div className="login-card" style={{
          background:'white', borderRadius:20,
          border:'1.5px solid #e5e7eb',
          overflow:'hidden',
          boxShadow:'0 8px 32px rgba(0,0,0,0.08)',
        }}>
          {/* Header */}
          <div style={{
            padding:'36px 36px 28px',
            background:'linear-gradient(135deg,#0ea5e9,#818cf8,#ec4899)',
            textAlign:'center',
          }}>
            <div style={{
              width:60,height:60,borderRadius:16,
              background:'rgba(255,255,255,0.2)',
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 14px',
            }}><IcoShield/></div>
            <h1 style={{color:'white',fontSize:'1.4rem',fontWeight:800,marginBottom:4}}>Admin Portal</h1>
            <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.83rem'}}>Authorized personnel only</p>
          </div>

          {/* Form */}
          <div className="login-form-body" style={{padding:'28px 32px 32px'}}>
            {error && (
              <div style={{
                display:'flex',alignItems:'center',gap:8,
                background:'#fef2f2',border:'1.5px solid #fecaca',
                borderRadius:8,padding:'10px 14px',
                fontSize:'0.82rem',color:'#b91c1c',marginBottom:18,
              }}>
                <IcoAlert/> {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label">Email Address</label>
                <input className="field-input" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="admin@example.com" autoFocus/>
              </div>
              <div className="field" style={{marginBottom:20}}>
                <label className="field-label">Password</label>
                <input className="field-input" type="password" value={pass} onChange={e=>setPass(e.target.value)}
                  placeholder="••••••••••"/>
              </div>
              <button type="submit" disabled={loading} style={{
                width:'100%',padding:'13px',
                background:'linear-gradient(135deg,#0ea5e9,#818cf8)',
                color:'white',border:'none',borderRadius:10,
                fontSize:'0.95rem',fontWeight:700,cursor:loading?'not-allowed':'pointer',
                fontFamily:'Inter,sans-serif',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                boxShadow:'0 4px 14px rgba(14,165,233,0.3)',
                opacity:loading?0.7:1,
              }}>
                {loading ? <><div className="spinner"/>Signing in…</> : 'Sign In'}
              </button>
            </form>

            <div style={{height:1,background:'#f3f4f6',margin:'20px 0 16px'}}/>
            <div style={{fontSize:'0.75rem',color:'#9ca3af',lineHeight:1.8}}>
              <p style={{fontWeight:600,color:'#374151',marginBottom:4}}></p>
              <p></p>
              <p> <code style={{background:'#f9fafb',padding:'1px 5px',borderRadius:4,color:'#374151'}}></code></p>
              
            </div>
          </div>
        </div>
        <p style={{textAlign:'center',marginTop:14,fontSize:'0.8rem'}}>
          <Link to="/" style={{color:'#9ca3af'}}>← Back to EXPOSER</Link>
        </p>
      </div>
    </div>
  );
}
