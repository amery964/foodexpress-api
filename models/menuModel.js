const mongoose = require('mongoose');
const Joi = require('joi');

const menuSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

const validateMenu = (menu) => {
  const schema = Joi.object({
    restaurant_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required()
  });
  return schema.validate(menu);
};

const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu, validateMenu };
