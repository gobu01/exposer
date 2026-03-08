// src/components/Navbar.js
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const IcoLock  = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IcoLogOut = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Navbar() {
  const { profile, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const navLink = (to, label) => (
    <Link to={to} style={{
      padding: '8px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500,
      color: pathname === to ? '#0ea5e9' : '#374151',
      background: pathname === to ? '#f0f9ff' : 'transparent',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => { if (pathname !== to) { e.currentTarget.style.color = '#0ea5e9'; e.currentTarget.style.background = '#f0f9ff'; }}}
    onMouseLeave={e => { if (pathname !== to) { e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = 'transparent'; }}}
    >{label}</Link>
  );

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 68, background: 'white',
      borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 0 #f3f4f6',
    }}>
      {/* ── Logo ── */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: '#0ea5e9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: '0.95rem',
        }}>E</div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9', letterSpacing: '-0.5px' }}>
          EXPOSER
        </span>
      </Link>

      {/* ── Links ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navLink('/', 'Home')}
        {navLink('/report', 'Report Case')}
        {navLink('/track', 'Track Cases')}
        {navLink('/about', 'About')}

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 6px' }} />

        {profile ? (
          <>
            {navLink('/dashboard', 'Dashboard')}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', background: '#f9fafb',
              borderRadius: 20, border: '1px solid #e5e7eb',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg,#0ea5e9,#818cf8,#ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '0.7rem', fontWeight: 700,
              }}>{profile.name?.[0]?.toUpperCase() || 'A'}</div>
              <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 500 }}>{profile.name}</span>
              <span style={{
                fontSize: '0.65rem', background: '#ede9fe', color: '#5b21b6',
                padding: '2px 7px', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize',
              }}>{profile.role}</span>
            </div>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', background: 'white',
              border: '1.5px solid #fce7f3', borderRadius: 8,
              color: '#ec4899', fontSize: '0.82rem', cursor: 'pointer',
              fontFamily: 'Inter,sans-serif', fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
            >
              <IcoLogOut /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', background: 'white', border: '1.5px solid #e5e7eb',
              borderRadius: 10, color: '#374151', fontSize: '0.88rem', fontWeight: 600,
              transition: 'all 0.2s', fontFamily: 'Inter,sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.color = '#0ea5e9'; e.currentTarget.style.background = '#f0f9ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = 'white'; }}
            >
              <IcoLock /> Admin Login
            </Link>
            <Link to="/report" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '9px 20px', background: '#0ea5e9', color: 'white',
              borderRadius: 10, fontSize: '0.88rem', fontWeight: 700,
              boxShadow: '0 4px 12px rgba(14,165,233,0.3)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0284c7'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(14,165,233,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(14,165,233,0.3)'; }}
            >
              Report Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
