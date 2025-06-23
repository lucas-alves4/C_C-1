const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const setupDatabase = require('./database');

const app = express();
const port = 3000;
const JWT_SECRET = 'your-super-secret-key-change-this';

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await setupDatabase();
})();

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, location, userType } = req.body;
  if (!name || !email || !password || !userType) {
    return res.status(400).json({ message: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO Users (name, email, password, phone, location, user_type) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, location, userType]
    );
    res.status(201).json({ userId: result.lastID, message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM Users WHERE email = ?', [email]);
  if (user == null) {
    return res.status(400).send('Usuário não encontrado');
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ id: user.id, name: user.name, type: user.user_type }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ accessToken: accessToken, user: { id: user.id, name: user.name, email: user.email } });
    } else {
      res.status(401).send('Senha Incorreta');
    }
  } catch {
    res.status(500).send();
  }
});

// --- ROTAS DE PROFISSIONAIS ---
app.get('/api/professionals', async (req, res) => {
  try {
    const professionals = await db.all(`
        SELECT 
            u.id, u.name, u.avatar, u.location as distance,
            (SELECT AVG(rating) FROM Reviews WHERE professional_id = u.id) as rating,
            (SELECT COUNT(*) FROM Reviews WHERE professional_id = u.id) as reviewCount
        FROM Users u
        WHERE u.user_type = 'professional'
    `);
    const formattedProfessionals = professionals.map(p => ({
        ...p,
        price: 'R$ 80-120/h',
        specialties: ['Móveis', 'Estantes', 'Guarda-roupas'],
        verified: true,
        responseTime: `${Math.floor(Math.random() * 10) + 5} min`,
        rating: p.rating ? parseFloat(p.rating.toFixed(1)) : 4.5,
        reviewCount: p.reviewCount || Math.floor(Math.random() * 100),
    }));
    res.json(formattedProfessionals);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar profissionais", error: error.message });
  }
});

// Outras rotas (serviços, chat, etc.) permanecem as mesmas
// ... (código do server.js da resposta anterior)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});