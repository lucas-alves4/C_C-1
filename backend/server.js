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

async function initializeServer() {
  const db = await setupDatabase();

  // ROTA DE ATUALIZAÇÃO DE PERFIL
  app.put('/api/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, location } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Nome e email são obrigatórios." });
    try {
        await db.run(`UPDATE Users SET name = ?, email = ?, phone = ?, location = ? WHERE id = ?`, [name, email, phone, location, id]);
        res.json({ message: "Perfil atualizado com sucesso!" });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ message: 'Este e-mail já está em uso.' });
        res.status(500).json({ message: "Erro ao atualizar o perfil.", error: error.message });
    }
  });

  // ROTAS DE AUTENTICAÇÃO
  app.post('/api/register', async (req, res) => {
    const { name, email, password, phone, location, userType } = req.body;
    if (!name || !email || !password || !userType) return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run('INSERT INTO Users (name, email, password, phone, location, user_type) VALUES (?, ?, ?, ?, ?, ?)', [name, email, hashedPassword, phone, location, userType]);
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ message: 'Este e-mail já está em uso.' });
      res.status(500).json({ message: 'Erro interno ao registrar usuário.', error: error.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM Users WHERE email = ?', [email]);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const accessToken = jwt.sign({ id: user.id, name: user.name, type: user.user_type }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.status(401).json({ message: 'Senha Incorreta.' });
        }
    } catch (err){ res.status(500).json({ message: 'Ocorreu um erro interno no login.', error: err.message }); }
  });

  // ROTAS DE DADOS
  app.get('/api/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.get('SELECT * FROM Users WHERE id = ?', [id]);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        let stats;
        if (user.user_type === 'professional') {
             stats = await db.get(`SELECT (SELECT COUNT(*) FROM Services WHERE professional_id = ?) as servicesCount, (SELECT AVG(rating) FROM Reviews WHERE professional_id = ?) as avgRating, (SELECT COUNT(*) FROM Reviews WHERE professional_id = ?) as reviewsCount`, [id, id, id]);
        } else {
            stats = await db.get(`SELECT (SELECT COUNT(*) FROM Services WHERE client_id = ?) as servicesCount, (SELECT AVG(rating) FROM Reviews WHERE reviewer_id = ?) as avgRating, (SELECT COUNT(*) FROM Reviews WHERE reviewer_id = ?) as reviewsCount`, [id, id, id]);
        }
        res.json({ ...user, stats });
    } catch (error) { res.status(500).json({ message: "Erro ao buscar perfil.", error: error.message }); }
  });

  app.get('/api/professionals', async (req, res) => {
    try {
      const professionals = await db.all(`SELECT u.id, u.name, u.avatar, u.location, (SELECT AVG(rating) FROM Reviews WHERE professional_id = u.id) as rating, (SELECT COUNT(*) FROM Reviews WHERE professional_id = u.id) as reviewCount FROM Users u WHERE u.user_type = 'professional'`);
      res.json(professionals.map(p => ({...p, price: 'R$ 80-120/h', specialties: ['Móveis', 'Estantes'], verified: true, distance: p.location, responseTime: `${Math.floor(Math.random()*10)+5} min`})));
    } catch (error) { res.status(500).json({ message: "Erro ao buscar profissionais", error: error.message }); }
  });

  app.listen(port, () => {
    console.log(`Servidor robusto rodando em http://localhost:${port}`);
  });
}

initializeServer().catch(err => {
  console.error("Falha ao iniciar o servidor:", err);
  process.exit(1);
});