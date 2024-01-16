const mongoose = require('mongoose');


const MotivationSchema = new mongoose.Schema({
    quote: String,
  });

  const Motivation = mongoose.model('Motivation', MotivationSchema);
  module.exports = Motivation;