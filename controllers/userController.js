const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/userModel');

// GET : récupérer tous les utilisateurs (admin uniquement)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // on ne renvoie pas les passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : récupérer un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : créer un nouvel utilisateur
const createUser = async (req, res) => {
  // Validation avec Joi
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Vérifier si email existe déjà
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role || 'user'
    });

    const savedUser = await newUser.save();
    res.status(201).json({ 
      id: savedUser._id, 
      email: savedUser.email, 
      username: savedUser.username,
      role: savedUser.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT : mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Hash du nouveau mot de passe si présent
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    Object.assign(user, req.body);
    const updatedUser = await user.save();

    res.json({ 
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE : supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await user.remove();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };

