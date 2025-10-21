const { Restaurant, validateRestaurant } = require('../models/restaurantModel');

// GET : tous les restaurants (public, tri + pagination)
const getRestaurants = async (req, res) => {
  try {
    const allowedSort = ['name', 'address'];
    const sortBy = allowedSort.includes(req.query.sortBy) ? req.query.sortBy : 'name';
    const order = req.query.order === 'desc' ? -1 : 1;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const total = await Restaurant.countDocuments();
    const items = await Restaurant.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    res.json({ items, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : un restaurant par ID (public)
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant non trouvé' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : créer un restaurant (admin)
const createRestaurant = async (req, res) => {
  const { error } = validateRestaurant(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH : mise à jour partielle (admin)
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant non trouvé' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE : supprimer un restaurant (admin)
const deleteRestaurant = async (req, res) => {
  try {
    const del = await Restaurant.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Restaurant non trouvé' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
