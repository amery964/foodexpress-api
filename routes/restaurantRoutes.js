const express = require('express');
const router = express.Router();
const {
     getRestaurants,
     getRestaurantById,
     createRestaurant,
     updateRestaurant,
     deleteRestaurant
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', createRestaurant);      // POST /api/restaurants
router.put('/:id', updateRestaurant);    // PUT /api/restaurants/:id
router.delete('/:id', deleteRestaurant); // DELETE /api/restaurants/:id


module.exports = router;
