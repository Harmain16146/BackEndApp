const express = require('express');
const router = express.Router();
const Motivation = require('../models/motivation');


router.get('/motivation-quote', async (req, res) => {
  try {
    const motivation = await Motivation.find();
    res.json(motivation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/motivation-quote',  async (req, res) => {
  console.log('Request Body:', req.body.quote);
    try{
      
        const motivation = new Motivation({
            quote: req.body.quote,  
          });
          
          const savedMotivation = await motivation.save();
          res.json(savedMotivation);  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/motivation-quote/:id', async (req, res) => {
    try {
      const quoteId = req.params.id;
     
      
  
      
  
      const motivation =({
        quote: req.body.quote,  
      });
  
      const updatedMotivation = await Motivation.findByIdAndUpdate(quoteId, motivation, { new: true });
      res.json(updatedMotivation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/motivation-quote/:id', async (req, res) => {
    try {
      const motiId = req.params.id;
      
      // Check if the workout plan exists
      const motivation = await Motivation.findById(motiId);
      if (!Motivation) {
        return res.status(404).json({ message: 'Motivational Quote not found' });
      }
  
      // Delete the workout plan
      await Motivation.findByIdAndDelete(motiId);
  
      res.json({ message: 'Motivational Quote  deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;