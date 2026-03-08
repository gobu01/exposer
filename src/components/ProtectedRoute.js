// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div className="spinner spinner-blue" style={{ width:36, height:36, borderWidth:3, margin:'0 auto 14px' }} />
        <p style={{ color:'#9ca3af', fontSize:'0.85rem' }}>Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" replace />;
  return children;
}
