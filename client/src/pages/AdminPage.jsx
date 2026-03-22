import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyClass = {
  name: '',
  coach: '',
  time: '',
  day: '',
  category: '',
  capacity: 10,
};

export default function AdminPage({ user }) {
  const [form, setForm] = useState(emptyClass);
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadClasses() {
    try {
      const data = await api('/classes');
      setClasses(data.classes);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  function onChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.name === 'capacity' ? Number(event.target.value) : event.target.value,
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await api('/classes', { method: 'POST', body: { ...form, createdBy: user?.id, role: user?.role } });
      setForm(emptyClass);
      setMessage('Тренировката е добавена успешно.');
      loadClasses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeClass(classId) {
    try {
      await api(`/classes/${classId}`, { method: 'DELETE', body: { userId: user?.id, role: user?.role } });
      setMessage('Тренировката е изтрита.');
      loadClasses();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <main className="container narrow">
        <div className="card">
          <h2>Достъп отказан</h2>
          <p>Само администратор може да отваря този панел.</p>
          <p className="muted">Използвай: admin@fitclub.com / admin123</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container admin-layout">
      <section className="card">
        <h2>Добавяне на тренировка</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={onSubmit} className="form-grid two-columns">
          <label>Име<input name="name" value={form.name} onChange={onChange} required /></label>
          <label>Треньор<input name="coach" value={form.coach} onChange={onChange} required /></label>
          <label>Ден<input name="day" value={form.day} onChange={onChange} placeholder="Понеделник" required /></label>
          <label>Час<input name="time" value={form.time} onChange={onChange} placeholder="18:30" required /></label>
          <label>Категория<input name="category" value={form.category} onChange={onChange} placeholder="HIIT / Йога" required /></label>
          <label>Капацитет<input type="number" min="1" name="capacity" value={form.capacity} onChange={onChange} required /></label>
          <button className="button accent">Добави</button>
        </form>
      </section>

      <section className="card">
        <h2>Съществуващи тренировки</h2>
        <div className="stack-list">
          {classes.map((item) => (
            <div key={item.id} className="stack-row">
              <div>
                <strong>{item.name}</strong>
                <p className="muted">{item.day} · {item.time} · {item.coach}</p>
              </div>
              <button className="button ghost" onClick={() => removeClass(item.id)}>Изтрий</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
