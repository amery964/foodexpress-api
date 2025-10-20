const { Restaurant, validateRestaurant } = require('../models/restaurantModel');

// GET : récupérer tous les restaurants (lecture publique, avec tri et pagination)
const getRestaurants = async (req, res) => {
  try {
    const { sortBy = 'name', limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find()
      .sort({ [sortBy]: 1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET : récupérer un restaurant par ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant non trouvé' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST : créer un restaurant (admin uniquement)
const createRestaurant = async (req, res) => {
  const { error } = validateRestaurant(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT : mettre à jour un restaurant (admin uniquement)
const updateRestaurant = async (req, res) => {
  const { error } = validateRestaurant(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRestaurant) return res.status(404).json({ message: 'Restaurant non trouvé' });
    res.json(updatedRestaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE : supprimer un restaurant (admin uniquement)
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant non trouvé' });

    await restaurant.remove();
    res.json({ message: 'Restaurant supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant };
