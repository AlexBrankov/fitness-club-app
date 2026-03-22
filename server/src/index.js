const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb, ensureDatabase } = require('./db');

ensureDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'FitClub API работи.' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Всички полета са задължителни.' });
  }

  const db = readDb();
  const exists = db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Този имейл вече съществува.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role: 'member',
    bookings: []
  };

  db.users.push(newUser);
  writeDb(db);

  return res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, bookings: newUser.bookings }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Имейлът и паролата са задължителни.' });
  }

  const db = readDb();
  const user = db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Невалидни данни за вход.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Невалидни данни за вход.' });
  }

  return res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, bookings: user.bookings }
  });
});

app.get('/api/classes', (_req, res) => {
  const db = readDb();
  res.json({ classes: db.classes });
});

app.post('/api/classes', (req, res) => {
  const { name, coach, time, day, category, capacity, role } = req.body;
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Само администратор може да добавя тренировки.' });
  }

  if (!name || !coach || !time || !day || !category || !capacity) {
    return res.status(400).json({ message: 'Моля, попълни всички полета.' });
  }

  const db = readDb();
  const newClass = {
    id: uuidv4(),
    name,
    coach,
    time,
    day,
    category,
    capacity: Number(capacity),
    bookedUserIds: []
  };
  db.classes.push(newClass);
  writeDb(db);
  res.status(201).json({ item: newClass });
});

app.delete('/api/classes/:id', (req, res) => {
  const { role } = req.body;
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Само администратор може да изтрива тренировки.' });
  }
  const db = readDb();
  db.classes = db.classes.filter((item) => item.id !== req.params.id);
  db.users = db.users.map((user) => ({
    ...user,
    bookings: user.bookings.filter((bookingId) => bookingId !== req.params.id)
  }));
  writeDb(db);
  res.json({ ok: true });
});

app.post('/api/classes/:id/book', (req, res) => {
  const { userId } = req.body;
  const db = readDb();
  const item = db.classes.find((entry) => entry.id === req.params.id);
  const user = db.users.find((entry) => entry.id === userId);

  if (!item || !user) return res.status(404).json({ message: 'Потребителят или тренировката не са намерени.' });
  if (item.bookedUserIds.includes(userId)) {
    return res.status(400).json({ message: 'Вече си записан за тази тренировка.' });
  }
  if (item.bookedUserIds.length >= item.capacity) {
    return res.status(400).json({ message: 'Няма свободни места.' });
  }

  item.bookedUserIds.push(userId);
  user.bookings.push(item.id);
  writeDb(db);

  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, bookings: user.bookings } });
});

app.post('/api/classes/:id/cancel', (req, res) => {
  const { userId } = req.body;
  const db = readDb();
  const item = db.classes.find((entry) => entry.id === req.params.id);
  const user = db.users.find((entry) => entry.id === userId);

  if (!item || !user) return res.status(404).json({ message: 'Потребителят или тренировката не са намерени.' });

  item.bookedUserIds = item.bookedUserIds.filter((id) => id !== userId);
  user.bookings = user.bookings.filter((id) => id !== item.id);
  writeDb(db);

  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, bookings: user.bookings } });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
