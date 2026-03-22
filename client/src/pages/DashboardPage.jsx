import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

export default function DashboardPage({ user }) {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadClasses() {
    try {
      setLoading(true);
      const data = await api('/classes');
      setClasses(data.classes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const bookedIds = useMemo(() => new Set(user?.bookings || []), [user]);

  async function book(classId) {
    if (!user) {
      setError('Трябва първо да влезеш в профила си.');
      return;
    }
    try {
      const data = await api(`/classes/${classId}/book`, {
        method: 'POST',
        body: { userId: user.id }
      });
      localStorage.setItem('fitclub-user', JSON.stringify(data.user));
      setMessage('Успешно записване за тренировка.');
      setError('');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function cancel(classId) {
    try {
      const data = await api(`/classes/${classId}/cancel`, {
        method: 'POST',
        body: { userId: user.id }
      });
      localStorage.setItem('fitclub-user', JSON.stringify(data.user));
      setMessage('Записването е отменено.');
      setError('');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <section className="page-header">
        <div>
          <h2>График на тренировките</h2>
          <p>Преглед на всички тренировки, свободни места и записвания.</p>
        </div>
      </section>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {loading ? <p>Зареждане...</p> : (
        <div className="class-grid">
          {classes.map((item) => {
            const isBooked = bookedIds.has(item.id);
            return (
              <article key={item.id} className="card class-card">
                <div className="class-topline">
                  <span className="pill">{item.category}</span>
                  <span>{item.day}</span>
                </div>
                <h3>{item.name}</h3>
                <p>Треньор: <strong>{item.coach}</strong></p>
                <p>Час: <strong>{item.time}</strong></p>
                <p>Свободни места: <strong>{item.capacity - item.bookedUserIds.length}</strong> / {item.capacity}</p>
                <div className="class-actions">
                  {!isBooked ? (
                    <button className="button accent" onClick={() => book(item.id)}>Запиши се</button>
                  ) : (
                    <button className="button ghost" onClick={() => cancel(item.id)}>Откажи</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
