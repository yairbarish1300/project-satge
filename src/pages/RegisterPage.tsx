import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !password) {
      setError('יש למלא את כל השדות');
      return;
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    setSubmitting(true);
    try {
      await register({ fullName, username, password, isManager });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ההרשמה נכשלה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="rp-login-shell login-page">
      <button type="button" className="rp-back-home-btn" onClick={handleBackHome}>
        <span>חזור לדף הבית</span>
        <span className="rp-back-arrow" aria-hidden="true">&gt;&gt;</span>
      </button>

      <main className="rp-login-box">
        <header className="rp-login-head">
          <h1>STAGE</h1>
          <p>רישום עובד חדש</p>
        </header>

        <form onSubmit={handleRegister}>
          <div className="rp-field">
            <label>שם מלא</label>
            <input
              className="rp-input"
              type="text"
              placeholder="הזן שם מלא"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="rp-field">
            <label>שם משתמש</label>
            <input
              className="rp-input"
              type="text"
              placeholder="הזן שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="rp-field">
            <label>סיסמה</label>
            <input
              className="rp-input"
              type="password"
              placeholder="לפחות 6 תווים"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="rp-field">
            <label>אימות סיסמה</label>
            <input
              className="rp-input"
              type="password"
              placeholder="הזן שוב את הסיסמה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <label className="rp-checkbox-field">
            <input type="checkbox" checked={isManager} onChange={(e) => setIsManager(e.target.checked)} />
            <span>הרשמה בתור מנהל (מקבל גם גישה לניהול עובדים)</span>
          </label>

          {error && <p className="rp-error">{error}</p>}

          <div className="rp-login-links" role="navigation" aria-label="Register help links">
            <span />
            <a
              href="#"
              className="rp-login-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              יש לי כבר חשבון
            </a>
          </div>

          <div className="rp-login-actions">
            <button type="submit" className="rp-login-btn" disabled={submitting}>
              {submitting ? 'נרשם...' : 'הירשם'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
