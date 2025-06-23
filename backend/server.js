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
    // Adicionando dados mockados que não estão no DB ainda
    const formattedProfessionals = professionals.map(p => ({
        ...p,
        price: 'R$ 80-120/h',
        specialties: ['Móveis', 'Estantes', 'Guarda-roupas'],
        verified: true,
        responseTime: `${Math.floor(Math.random() * 10) + 5} min`,
        rating: p.rating ? parseFloat(p.rating.toFixed(1)) : 4.5, // Mock rating se for null
        reviewCount: p.reviewCount || Math.floor(Math.random() * 100), // Mock reviews se for 0
    }));
    res.json(formattedProfessionals);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar profissionais", error: error.message });
  }
});


// --- ROTAS DE SERVIÇOS ---
app.get('/api/services', async (req, res) => {
    // Aqui você adicionaria um filtro pelo usuário logado (ex: `WHERE client_id = ?`)
    try {
        const services = await db.all(`
            SELECT s.id, s.title, s.date, s.time, s.location, s.status, s.price, s.image_url as image,
                   p.name as professional_name, p.avatar as professional_avatar,
                   (SELECT AVG(r.rating) FROM Reviews r WHERE r.professional_id = p.id) as professional_rating
            FROM Services s
            JOIN Users p ON s.professional_id = p.id
            ORDER BY s.created_at DESC
        `);
        const formatted = services.map(s => ({...s, professional: { name: s.professional_name, avatar: s.professional_avatar, rating: s.professional_rating }}));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar serviços", error: error.message });
    }
});

app.post('/api/service-request', async (req, res) => {
    const { serviceType, description, location, preferredDate, preferredTime, budget } = req.body;
    // const clientId = req.user.id; // Buscar do token JWT no futuro
    const clientId = 1; 
    try {
        // Encontra um profissional aleatório para associar ao serviço
        const professional = await db.get("SELECT id FROM Users WHERE user_type = 'professional' ORDER BY RANDOM() LIMIT 1");
        if (!professional) return res.status(500).json({message: "Nenhum profissional disponível para atribuir."});

        const result = await db.run(
            `INSERT INTO Services (client_id, professional_id, title, description, location, date, time, price, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [clientId, professional.id, serviceType, description, location, preferredDate, preferredTime, parseFloat(budget) || 0]
        );
        res.status(201).json({ serviceId: result.lastID, message: "Solicitação enviada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar solicitação", error: error.message });
    }
});


// --- ROTAS DE MENSAGENS (Simplificado) ---
app.get('/api/conversations', async (req, res) => {
    try {
        const professionals = await db.all("SELECT id, name, avatar FROM Users WHERE user_type = 'professional' LIMIT 4");
        const messages = professionals.map((p, i) => ({
            id: p.id,
            professional: { name: p.name, avatar: p.avatar, online: i % 2 === 0 },
            lastMessage: i % 2 === 0 ? 'Olá! Podemos combinar o horário?' : 'Ok, combinado!',
            timestamp: i % 2 === 0 ? '10:45' : 'Ontem',
            unreadCount: i === 0 ? 2 : 0,
            status: i % 3 === 0 ? 'read' : (i % 3 === 1 ? 'delivered' : 'sent'),
        }));
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar conversas" });
    }
});

app.get('/api/chat/:professionalId', async (req, res) => {
    const professionalName = req.params.professionalId;
    const professional = { name: professionalName, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' };
    const messages = [
        { id: '1', text: 'Olá! Vi sua solicitação. Posso ajudar!', sender: 'professional', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', text: 'Oi! Que bom! Qual o valor?', sender: 'user', timestamp: new Date(Date.now() - 3500000) },
    ];
    res.json({ messages, professional });
});


// --- ROTAS DE AVALIAÇÃO ---
app.post('/api/review', async (req, res) => {
    const { serviceId, rating, comment } = req.body;
    // const reviewerId = req.user.id;
    const reviewerId = 1;
    try {
        const service = await db.get('SELECT professional_id FROM Services WHERE id = ?', [serviceId]);
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });

        await db.run(
            'INSERT INTO Reviews (service_id, reviewer_id, professional_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [serviceId, reviewerId, service.professional_id, rating, comment]
        );
        res.status(201).json({ message: "Avaliação enviada com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao enviar avaliação", error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});