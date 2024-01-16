const { Binary } = require('mongodb');
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  image: String,
  video: String,
  duration: String,
  calories: String,
});

const workoutPlanSchema = new mongoose.Schema({
  name: String,
  image: String,
  duration: String,
  difficulty: String,
  exercises: [exerciseSchema], // Define exercises as an array of exerciseSchema
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
module.exports = WorkoutPlan;
