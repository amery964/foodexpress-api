const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin')
  });
  return schema.validate(user);
};

const User = mongoose.model('User', userSchema);

module.exports = { User, validateUser };
