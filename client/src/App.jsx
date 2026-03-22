import { NavLink, Route, Routes } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { api } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fitclub-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const auth = useMemo(() => ({
    user,
    async login(form) {
      const data = await api('/auth/login', { method: 'POST', body: form });
      setUser(data.user);
      localStorage.setItem('fitclub-user', JSON.stringify(data.user));
      return data.user;
    },
    async register(form) {
      const data = await api('/auth/register', { method: 'POST', body: form });
      setUser(data.user);
      localStorage.setItem('fitclub-user', JSON.stringify(data.user));
      return data.user;
    },
    logout() {
      setUser(null);
      localStorage.removeItem('fitclub-user');
    }
  }), [user]);

  if (loading) return <div className="center-screen">Зареждане...</div>;

  return (
    <div>
      <header className="topbar">
        <div className="container topbar-inner">
          <div>
            <h1 className="brand">FitClub Manager</h1>
            <p className="brand-subtitle">Демо приложение за фитнес клуб</p>
          </div>
          <nav className="navlinks">
            <NavLink to="/">Начало</NavLink>
            <NavLink to="/dashboard">График</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin">Админ</NavLink>}
            {!user ? (
              <NavLink to="/auth" className="button-link accent">Вход</NavLink>
            ) : (
              <button className="button ghost" onClick={auth.logout}>Изход</button>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/auth" element={<AuthPage auth={auth} user={user} />} />
        <Route path="/dashboard" element={<DashboardPage user={user} />} />
        <Route path="/admin" element={<AdminPage user={user} />} />
      </Routes>
    </div>
  );
}
