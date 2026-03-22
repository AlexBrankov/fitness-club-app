# Fitness Club App

Пълно demo уеб приложение за фитнес клуб, готово за GitHub и представяне.

## Какво включва
- React frontend
- Express backend
- Регистрация и вход
- Роли: `member` и `admin`
- График с тренировки
- Записване и отписване за тренировки
- Админ панел за добавяне и изтриване на тренировки
- Локално JSON съхранение, за да стартира без външна база данни

## Demo акаунти
След първото стартиране backend-ът автоматично създава:
- Админ: `admin@fitclub.com` / `admin123`
- Потребител: `member@fitclub.com` / `member123`

## Стартиране
```bash
npm install
npm run dev
```

След това отвори:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

## GitHub качване
```bash
git init
git add .
git commit -m "Initial commit - fitness club app"
git branch -M main
git remote add origin https://github.com/ТВОЕТО-ИМЕ/fitness-club-app.git
git push -u origin main
```

## Структура
```text
fitness-club-app/
  client/   # React приложение
  server/   # Express API
```

## Технологии
- React
- Vite
- Express
- bcryptjs
- CORS
