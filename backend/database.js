const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      avatar TEXT,
      user_type TEXT CHECK(user_type IN ('client', 'professional')) NOT NULL,
      notifications_enabled BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      professional_id INTEGER,
      title TEXT NOT NULL,
      date TEXT,
      time TEXT,
      location TEXT,
      price REAL,
      status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES Users(id),
      FOREIGN KEY (professional_id) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER,
      reviewer_id INTEGER,
      professional_id INTEGER,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES Services(id),
      FOREIGN KEY (reviewer_id) REFERENCES Users(id),
      FOREIGN KEY (professional_id) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      professional_id INTEGER,
      last_message_timestamp DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES Users(id),
      FOREIGN KEY (professional_id) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER,
      sender_id INTEGER,
      text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_status BOOLEAN DEFAULT 0,
      FOREIGN KEY (conversation_id) REFERENCES Conversations(id),
      FOREIGN KEY (sender_id) REFERENCES Users(id)
    );
  `);

  console.log('Banco de dados configurado com sucesso.');
  return db;
}

module.exports = setupDatabase;