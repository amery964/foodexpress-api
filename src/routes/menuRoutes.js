const express = require('express');
const router = express.Router();
const ctl = require('../controllers/menuController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { validateMenu } = require('../models/menuModel');

// Public
router.get('/', ctl.getMenus);
router.get('/:id', ctl.getMenuById);

// Admin-only (avec validation)
router.post('/', authenticate(), requireRole('admin'), validate(validateMenu), ctl.createMenu);
// update partielle → validation optionnelle (tu peux créer un schema "menuUpdate" plus tard si tu veux)
router.patch('/:id', authenticate(), requireRole('admin'), ctl.updateMenu);
router.delete('/:id', authenticate(), requireRole('admin'), ctl.deleteMenu);

module.exports = router;
