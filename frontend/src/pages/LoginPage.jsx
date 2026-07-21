import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDENTIALS = [
  { role: '👑 Admin', email: 'admin@erp.com', password: 'Admin@123', badge: '✅ Full Access' },
  { role: '💰 Sales', email: 'sales@erp.com', password: 'Password@123', badge: '✅ Sales Module' },
  { role: '📦 Warehouse', email: 'warehouse@erp.com', password: 'Password@123', badge: '✅ Inventory' },
  { role: '📊 Accounts', email: 'accounts@erp.com', password: 'Password@123', badge: '✅ Reports' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (creds) => {
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>FUNDSROOM ERP</h1>
        <p>Sign in to your account</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <div className="demo-header">
            <span className="demo-icon">🔑</span>
            <span>Demo Credentials</span>
          </div>
          <p className="demo-subtitle">Click any account to auto-fill & login</p>
          <div className="demo-table">
            <div className="demo-table-header">
              <span>Role</span>
              <span>Email</span>
              <span>Password</span>
            </div>
            {DEMO_CREDENTIALS.map((creds) => (
              <div
                key={creds.email}
                className="demo-row"
                onClick={() => fillCredentials(creds)}
                title={`Click to use ${creds.role}`}
              >
                <span className="demo-role">{creds.role}</span>
                <span className="demo-email">{creds.email}</span>
                <span className="demo-pass">{creds.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

