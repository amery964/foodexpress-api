const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { User } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretchangeit';
const clean = (u) => ({ id: u._id, email: u.email, username: u.username, role: u.role });

// POST /api/users  (public)
exports.createUser = async (req, res) => {
  try {
    const { email, username, password, role } = req.body || {};
    if (!email || !username || !password) return res.status(400).json({ message: 'email, username, password requis' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email déjà utilisé' });
    const hash = await bcryptjs.hash(password, 10);
    const user = await User.create({ email, username, password: hash, role: role || 'user' });
    res.status(201).json(clean(user));
 } catch (err) {
  console.error('createUser error:', err);
   res.status(500).json({ message: 'Erreur serveur' });
 }
};

// POST /api/users/login  (public)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email et password requis' });
    const user = await User.findOne({ email });
    if (!user || !(await bcryptjs.compare(password, user.password))) return res.status(401).json({ message: 'Identifiants invalides' });
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch { res.status(500).json({ message: 'Erreur serveur' }); }
};

// GET /api/users  (admin via middleware)
exports.getUsers = async (_req, res) => {
  try {
    const items = await User.find().select('-password');
    res.json({ items, total: items.length });
  } catch { res.status(500).json({ message: 'Erreur serveur' }); }
};

// GET /api/users/me  (auth via middleware)
exports.getMe = (req, res) => res.json(clean(req.user));

// GET /api/users/:id  (self-or-admin via middleware)
exports.getUserById = async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(u);
  } catch { res.status(500).json({ message: 'Erreur serveur' }); }
};

// PATCH /api/users/:id  (self-or-admin via middleware)
exports.updateUser = async (req, res) => {
  try {
    const { email, username, password, role } = req.body || {};
    const updates = {};
    if (email !== undefined) updates.email = email;
    if (username !== undefined) updates.username = username;
    if (role !== undefined) updates.role = role;
    if (password !== undefined) updates.password = await bcryptjs.hash(password, 10);

    const u = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!u) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(clean(u));
  } catch { res.status(500).json({ message: 'Erreur serveur' }); }
};

// DELETE /api/users/:id  (self-or-admin via middleware)
exports.deleteUser = async (req, res) => {
  try {
    const del = await User.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(204).send();
  } catch { res.status(500).json({ message: 'Erreur serveur' }); }
};
