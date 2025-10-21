const express = require('express');
const router = express.Router();
const ctl = require('../controllers/userController');
const { authenticate, requireRole, selfOrAdmin } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { validateUser } = require('../models/userModel');

// Public routes
router.post('/', validate(validateUser), ctl.createUser); // inscription (avec validation)
router.post('/login', ctl.login);                         // connexion → JWT

// Authenticated routes
router.get('/me', authenticate(), ctl.getMe); // profil connecté
router.get('/', authenticate(), requireRole('admin'), ctl.getUsers); // admin : liste des users

// Self or admin
router.get('/:id', authenticate(), selfOrAdmin(), ctl.getUserById);
router.patch('/:id', authenticate(), selfOrAdmin(), validate(validateUser), ctl.updateUser);
router.delete('/:id', authenticate(), selfOrAdmin(), ctl.deleteUser);

module.exports = router;
