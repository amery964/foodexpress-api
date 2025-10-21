const mongoose = require('mongoose');
const Joi = require('joi');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  opening_hours: { type: String, required: true }
}, { timestamps: true });

const validateRestaurant = (restaurant) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    opening_hours: Joi.string().required()
  });
  return schema.validate(restaurant);
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = { Restaurant, validateRestaurant };
