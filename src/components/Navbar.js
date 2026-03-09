// src/components/Navbar.js
import { useState } from 'react';
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
const IcoMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IcoX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Navbar() {
  const { profile, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (to) => pathname === to;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      style={{
        padding: '8px 14px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500,
        color: isActive(to) ? '#0ea5e9' : '#374151',
        background: isActive(to) ? '#f0f9ff' : 'transparent',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!isActive(to)) { e.currentTarget.style.color = '#0ea5e9'; e.currentTarget.style.background = '#f0f9ff'; }}}
      onMouseLeave={e => { if (!isActive(to)) { e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = 'transparent'; }}}
    >{label}</Link>
  );

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 68, background: 'white',
        borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 1px 0 #f3f4f6',
      }} className="navbar">
        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: '#0ea5e9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0,
          }}>E</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9', letterSpacing: '-0.5px' }}>
            EXPOSER
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLink('/', 'Home')}
          {navLink('/report', 'Report Case')}
          {navLink('/track', 'Track Cases')}
          {navLink('/about', 'About')}
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
                fontFamily: 'Inter,sans-serif', fontWeight: 500, transition: 'all 0.15s',
              }}>
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
              }}>
                <IcoLock /> Admin Login
              </Link>
              <Link to="/report" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '9px 20px', background: '#0ea5e9', color: 'white',
                borderRadius: 10, fontSize: '0.88rem', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(14,165,233,0.3)', transition: 'all 0.2s',
              }}>
                Report Now
              </Link>
            </>
          )}
        </div>

        {/* ── Hamburger (mobile only) ── */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: 6, color: '#374151',
            borderRadius: 8,
          }}
        >
          {menuOpen ? <IcoX /> : <IcoMenu />}
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div className="nav-mobile-drawer" style={{
          position: 'fixed', top: 68, left: 0, right: 0, bottom: 0,
          background: 'white', zIndex: 199,
          overflowY: 'auto',
          borderTop: '1px solid #f3f4f6',
          padding: '16px 20px 32px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {/* Nav links */}
          {[['/', 'Home'], ['/report', 'Report Case'], ['/track', 'Track Cases'], ['/about', 'About']].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{
              padding: '13px 16px', borderRadius: 10, fontSize: '1rem', fontWeight: 500,
              color: isActive(to) ? '#0ea5e9' : '#374151',
              background: isActive(to) ? '#f0f9ff' : 'transparent',
              borderBottom: '1px solid #f9fafb',
            }}>{label}</Link>
          ))}

          {profile && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{
              padding: '13px 16px', borderRadius: 10, fontSize: '1rem', fontWeight: 500,
              color: isActive('/dashboard') ? '#0ea5e9' : '#374151',
              background: isActive('/dashboard') ? '#f0f9ff' : 'transparent',
              borderBottom: '1px solid #f9fafb',
            }}>Dashboard</Link>
          )}

          <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0' }} />

          {profile ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', background: '#f9fafb', borderRadius: 12,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#0ea5e9,#818cf8,#ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.85rem', fontWeight: 700,
                }}>{profile.name?.[0]?.toUpperCase() || 'A'}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{profile.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'capitalize' }}>{profile.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} style={{
                padding: '13px 16px', background: '#fdf2f8', border: '1.5px solid #fce7f3',
                borderRadius: 10, color: '#ec4899', fontSize: '0.9rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter,sans-serif', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <IcoLogOut /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                padding: '13px 16px', background: 'white', border: '1.5px solid #e5e7eb',
                borderRadius: 10, color: '#374151', fontSize: '0.9rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
              }}>
                <IcoLock /> Admin Login
              </Link>
              <Link to="/report" onClick={() => setMenuOpen(false)} style={{
                padding: '14px 16px', background: '#0ea5e9', color: 'white',
                borderRadius: 10, fontSize: '0.95rem', fontWeight: 700,
                textAlign: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
              }}>
                Report Now
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
