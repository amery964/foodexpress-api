const { Menu, validateMenu } = require('../models/menuModel');

// GET : récupérer tous les menus (lecture publique, tri et pagination)
const getMenus = async (req, res) => {
  try {
    const { sortBy = 'price', limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const menus = await Menu.find()
      .sort({ [sortBy]: 1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('restaurant_id', 'name address'); // affiche nom + adresse restaurant

    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : récupérer un menu par ID
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('restaurant_id', 'name address');
    if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : créer un menu (admin uniquement)
const createMenu = async (req, res) => {
  const { error } = validateMenu(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newMenu = new Menu(req.body);
    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT : mettre à jour un menu (admin uniquement)
const updateMenu = async (req, res) => {
  const { error } = validateMenu(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMenu) return res.status(404).json({ message: 'Menu non trouvé' });
    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE : supprimer un menu (admin uniquement)
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });

    await menu.remove();
    res.json({ message: 'Menu supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMenus, getMenuById, createMenu, updateMenu, deleteMenu };
