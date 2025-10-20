const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Routes CRUD utilisateurs
router.get('/', getUsers);          // GET /api/users
router.get('/:id', getUserById);    // GET /api/users/:id
router.post('/', createUser);       // POST /api/users
router.put('/:id', updateUser);     // PUT /api/users/:id
router.delete('/:id', deleteUser);  // DELETE /api/users/:id

module.exports = router;

