// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home         from './pages/Home';
import ReportCase   from './pages/ReportCase';
import TrackCase    from './pages/TrackCase';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import ReportDetail from './pages/ReportDetail';
import About        from './pages/About';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight:'100vh', background:'#ffffff' }}>
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/report"    element={<ReportCase />} />
            <Route path="/track"     element={<TrackCase />} />
            <Route path="/about"     element={<About />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['admin','investigator']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/report/:id" element={
              <ProtectedRoute roles={['admin','investigator']}>
                <ReportDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <div style={{ textAlign:'center', padding:'80px 24px' }}>
                <div style={{ fontSize:'4rem', marginBottom:16 }}>404</div>
                <h2 style={{ fontWeight:800, marginBottom:8 }}>Page Not Found</h2>
                <a href="/" style={{ color:'#0ea5e9', fontWeight:600 }}>← Back to Home</a>
              </div>
            } />
          </Routes>

          {/* Footer */}
          <footer style={{
            borderTop:'1px solid #f3f4f6', padding:'24px 40px',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:28, height:28, borderRadius:6, background:'#0ea5e9',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontWeight:800, fontSize:'0.8rem',
              }}>E</div>
              <span style={{ fontWeight:700, color:'#0ea5e9', fontSize:'0.92rem' }}>EXPOSER</span>
              <span style={{ color:'#9ca3af', fontSize:'0.78rem' }}>· Expose Corruption, Protect Democracy</span>
            </div>
            <p style={{ fontSize:'0.75rem', color:'#9ca3af' }}>
              College Study Project · Powered by Firebase & React
            </p>
          </footer>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          style={{ zIndex:9999 }}
          toastStyle={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', borderRadius:10 }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
