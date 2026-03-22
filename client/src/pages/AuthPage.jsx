import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialState = { name: '', email: '', password: '' };

export default function AuthPage({ auth, user }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  function onChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await auth.login({ email: form.email, password: form.password });
      } else {
        await auth.register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container narrow">
      <div className="card auth-card">
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вход</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Регистрация</button>
        </div>
        <h2>{mode === 'login' ? 'Влез в профила си' : 'Създай нов профил'}</h2>
        <p className="muted">Demo акаунт: member@fitclub.com / member123</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={onSubmit} className="form-grid">
          {mode === 'register' && (
            <label>
              Име
              <input name="name" value={form.name} onChange={onChange} placeholder="Иван Иванов" required />
            </label>
          )}
          <label>
            Имейл
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="name@example.com" required />
          </label>
          <label>
            Парола
            <input type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
          </label>
          <button className="button accent" disabled={busy}>{busy ? 'Моля изчакай...' : mode === 'login' ? 'Вход' : 'Регистрация'}</button>
        </form>
      </div>
    </main>
  );
}
