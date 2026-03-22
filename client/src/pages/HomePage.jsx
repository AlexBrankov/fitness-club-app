import { Link } from 'react-router-dom';

export default function HomePage({ user }) {
  return (
    <main>
      <section className="hero container">
        <div>
          <span className="badge">Готово за представяне</span>
          <h2>Уеб приложение за фитнес клуб с реалистични функции</h2>
          <p>
            Управлявай членове, график и записвания от едно място. Проектът е подготвен така,
            че да може да се стартира локално и да се качи в GitHub.
          </p>
          <div className="hero-actions">
            <Link to={user ? '/dashboard' : '/auth'} className="button accent">
              {user ? 'Виж графика' : 'Вход / Регистрация'}
            </Link>
            <a href="#features" className="button ghost">Какво включва</a>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat"><span>248</span><small>Активни членове</small></div>
          <div className="stat"><span>12</span><small>Тренировки днес</small></div>
          <div className="stat"><span>7</span><small>Треньори</small></div>
        </div>
      </section>

      <section id="features" className="container features-grid">
        {[
          ['Регистрация и вход', 'Потребителите могат да създават профил и да влизат в системата.'],
          ['График', 'Преглед на тренировки, треньори, часове и свободни места.'],
          ['Записване', 'Членовете могат да се записват и да се отписват с един бутон.'],
          ['Админ панел', 'Администраторът добавя и изтрива тренировки от системата.'],
        ].map(([title, text]) => (
          <article key={title} className="card">
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
