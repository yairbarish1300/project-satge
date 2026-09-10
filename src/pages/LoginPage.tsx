import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('יש למלא שם משתמש וסיסמה');
      return;
    }

    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ההתחברות נכשלה, נסה שוב');
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
          <p>כניסת עובד למערכת</p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="rp-field">
            <label>שם משתמש</label>
            <input className="rp-input" type="text" placeholder="הזן שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="rp-field">
            <label>סיסמה</label>
            <input className="rp-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="rp-error">{error}</p>}

          <div className="rp-login-links" role="navigation" aria-label="Login help links">
            <a href="#" className="rp-login-link">שכחתי סיסמה</a>
            <a
              href="#"
              className="rp-login-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              להירשם
            </a>
          </div>

          <div className="rp-login-actions">
            <button type="submit" className="rp-login-btn" disabled={submitting}>
              {submitting ? 'מתחבר...' : 'התחבר'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
