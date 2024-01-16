const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: String,
  image: String,
  quantity: String,
  calories: String,
});

const dietPlanSchema = new mongoose.Schema({
  name: String,
  image: String,
  time: String,
  category: String,
  description: String,
  goal: String,
  ingredients: [IngredientSchema], // Define exercises as an array of exerciseSchema
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
module.exports = DietPlan;