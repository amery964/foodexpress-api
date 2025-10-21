const { Menu, validateMenu } = require('../models/menuModel');
const { Restaurant } = require('../models/restaurantModel');

// GET : tous les menus (public, tri + pagination + filtre restaurant)
const getMenus = async (req, res) => {
  try {
    const allowedSort = ['price', 'category'];
    const sortBy = allowedSort.includes(req.query.sortBy) ? req.query.sortBy : 'price';
    const order = req.query.order === 'desc' ? -1 : 1;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const filter = req.query.restaurant_id ? { restaurant_id: req.query.restaurant_id } : {};

    const total = await Menu.countDocuments(filter);
    const items = await Menu.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate('restaurant_id', 'name address');

    res.json({ items, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : un menu par ID (public)
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('restaurant_id', 'name address');
    if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : créer un menu (admin)
const createMenu = async (req, res) => {
  const { error } = validateMenu(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // vérifier que le restaurant existe
    const restaurant = await Restaurant.findById(req.body.restaurant_id);
    if (!restaurant) return res.status(400).json({ message: 'restaurant_id invalide' });

    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH : mise à jour partielle (admin)
const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE : supprimer un menu (admin)
const deleteMenu = async (req, res) => {
  try {
    const del = await Menu.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Menu non trouvé' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
