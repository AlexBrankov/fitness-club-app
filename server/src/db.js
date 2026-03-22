const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

function ensureDatabase() {
  if (fs.existsSync(dbPath)) return;

  const adminPassword = bcrypt.hashSync('admin123', 10);
  const memberPassword = bcrypt.hashSync('member123', 10);
  const seed = {
    users: [
      { id: uuidv4(), name: 'Admin User', email: 'admin@fitclub.com', passwordHash: adminPassword, role: 'admin', bookings: [] },
      { id: uuidv4(), name: 'Member User', email: 'member@fitclub.com', passwordHash: memberPassword, role: 'member', bookings: [] }
    ],
    classes: [
      { id: uuidv4(), name: 'Функционална тренировка', coach: 'Иван Петров', day: 'Понеделник', time: '08:00', category: 'Фитнес', capacity: 12, bookedUserIds: [] },
      { id: uuidv4(), name: 'Йога', coach: 'Мария Георгиева', day: 'Сряда', time: '10:30', category: 'Йога', capacity: 16, bookedUserIds: [] },
      { id: uuidv4(), name: 'HIIT', coach: 'Николай Димитров', day: 'Петък', time: '18:30', category: 'Кардио', capacity: 10, bookedUserIds: [] }
    ]
  };

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2));
}

function readDb() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb, ensureDatabase };
