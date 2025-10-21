// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretchangeit';

// Auth: vérifie le token et attache req.user
exports.authenticate = () => async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Token invalide' });

    req.user = user; // dispo pour /me, ACL, etc.
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Rôle requis (ex: admin)
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Accès refusé' });
  next();
};

// Autoriser si admin OU si l’utilisateur agit sur lui-même
exports.selfOrAdmin = () => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  const isAdmin = req.user.role === 'admin';
  const isSelf = String(req.user._id) === String(req.params.id);
  if (!isAdmin && !isSelf) return res.status(403).json({ message: 'Accès refusé' });
  next();
};
