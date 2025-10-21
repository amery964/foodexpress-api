const express = require('express');
const router = express.Router();
const ctl = require('../controllers/restaurantController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { validateRestaurant } = require('../models/restaurantModel');

// Public
router.get('/', ctl.getRestaurants);
router.get('/:id', ctl.getRestaurantById);

// Admin-only (avec validation)
router.post('/', authenticate(), requireRole('admin'), validate(validateRestaurant), ctl.createRestaurant);
router.patch('/:id', authenticate(), requireRole('admin'), ctl.updateRestaurant); // update partielle → validation optionnelle

module.exports = router;
