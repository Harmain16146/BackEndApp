const express = require('express');
const router = express.Router();
const DietPlan = require('../models/diet')
const cloudinary = require('../helper/imageUpload');
const multer = require('multer');

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb('Invalid file type! Only images and videos are allowed.', false);
  }
};

const uploads = multer({ storage, fileFilter });

router.post('/diet-plans', async (req, res) => {
  try {
    //const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    const ingredientData = JSON.parse(req.body.ingredient);
     
    const ingredient = await Promise.all(ingredientData.map(async ingredient => {
      
      return {
        name: ingredient.name,
        image: ingredient.image,
        quantity: ingredient.quantity,
        calories: ingredient.calories,       
    };
    }));

    const newDietPlan = new DietPlan({
      name: req.body.name,
      image: req.body.image,
      time: req.body.time,
      category: req.body.category,
      description: req.body.description,
      goal: req.body.goal,
      ingredients: ingredient,
    });

    const savedDietPlan = await newDietPlan.save();
    res.json(savedDietPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/diet-plans', async (req, res) => {
  try {
    const dietPlans = await DietPlan.find();
    res.json(dietPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/diet-plans/:id', async (req, res) => {
  try {
    const dietId = req.params.id;
    
    // Check if the workout plan exists
    const dietPlan = await DietPlan.findById(dietId);
    if (!dietPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    // Delete the workout plan
    await DietPlan.findByIdAndDelete(dietId);

    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/diet-plans/:id', async (req, res) => {
  try {
      const dietId = req.params.id;
   // const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    const ingredientData = JSON.parse(req.body.ingredients);

    const ingredients = await Promise.all(ingredientData.map(async ingredient => {
      // Upload exercise image and video to Cloudinary if needed
      // const imageUploadResponse = await cloudinary.uploader.upload(exercise.image.path);
      // const videoUploadResponse = await cloudinary.uploader.upload(exercise.video.path);

      return {
        name: ingredient.name,
        image: ingredient.image,
        quantity: ingredient.quantity,
        calories: ingredient.calories,
      };
    }));

    const updateDietPlan = {
      name: req.body.name,
      image: req.body.image,
      time: req.body.time,
      category: req.body.category,
      description: req.body.description,
      goal: req.body.goal,
      ingredients: ingredients,
    };

    const updateDiet = await DietPlan.findByIdAndUpdate(dietId, updateDietPlan, { new: true });
    res.json(updateDiet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;