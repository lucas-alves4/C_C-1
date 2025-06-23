const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, phone TEXT, location TEXT,
      avatar TEXT, user_type TEXT CHECK(user_type IN ('client', 'professional')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS Services (
      id INTEGER PRIMARY KEY AUTOINCREMENT, client_id INTEGER, professional_id INTEGER, title TEXT NOT NULL, date TEXT, time TEXT, location TEXT,
      price REAL, status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) NOT NULL, image_url TEXT,
      FOREIGN KEY (client_id) REFERENCES Users(id), FOREIGN KEY (professional_id) REFERENCES Users(id)
    );
    CREATE TABLE IF NOT EXISTS Reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT, service_id INTEGER, reviewer_id INTEGER, professional_id INTEGER, rating INTEGER NOT NULL, comment TEXT,
      FOREIGN KEY (service_id) REFERENCES Services(id)
    );
  `);

  const testProfessional = await db.get("SELECT * FROM Users WHERE email = 'joao.silva@teste.com'");
  if (!testProfessional) {
    console.log("Criando dados de teste...");
    const hashedPassword = await bcrypt.hash('123456', 10);
    const professionalResult = await db.run(
      `INSERT INTO Users (name, email, password, user_type, location, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
      ['João Silva (Teste)', 'joao.silva@teste.com', hashedPassword, 'professional', 'São Paulo, SP', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2']
    );
    const professionalId = professionalResult.lastID;
    await db.run(
        `INSERT INTO Services (client_id, professional_id, title, date, time, location, price, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, professionalId, 'Montagem de Guarda-roupa', '15 Jan', '14:00', 'Rua das Flores, 123', 120, 'confirmed', 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2']
    );
  }

  console.log('Banco de dados configurado com sucesso.');
  return db;
}

module.exports = setupDatabase;