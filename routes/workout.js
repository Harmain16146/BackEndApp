const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/workout');
const mongoose = require('mongoose');
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

router.post('/workout-plans', async (req, res) => {
  try {
   // const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    const exercisesData = JSON.parse(req.body.exercises);
     
    const exercises = await Promise.all(exercisesData.map(async exercise => {
      // Upload exercise image to Cloudinary
    //  const imageUploadResponse = await cloudinary.uploader.upload(exercisesData.path);
    //  const videoUploadResponse = await cloudinary.uploader.upload(exercise.video.path);

      return {
        name: exercise.name,
        image: exercise.image,
       video:exercise.video,
        duration: exercise.duration,
        calories: exercise.calories,
      };
    }));

    const newWorkoutPlan = new WorkoutPlan({
      name: req.body.name,
      image: req.body.image,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      exercises: exercises,
    });

    const savedWorkoutPlan = await newWorkoutPlan.save();
    res.json(savedWorkoutPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/workout-plans', async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find();
    res.json(workoutPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/workout-plans/:id', async (req, res) => {
  try {
    const workoutId = new mongoose.Types.ObjectId(req.params.id);
   // const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    const exercisesData = JSON.parse(req.body.exercises);

    const exercises = await Promise.all(exercisesData.map(async exercise => {
      // Upload exercise image and video to Cloudinary if needed
      // const imageUploadResponse = await cloudinary.uploader.upload(exercise.image.path);
      // const videoUploadResponse = await cloudinary.uploader.upload(exercise.video.path);

      return {
        name: exercise.name,
        image: exercise.image,
        video: exercise.video,
        duration: exercise.duration,
        calories: exercise.calories,
      };
    }));

    const updatedWorkoutPlan = {
      name: req.body.name,
      image: req.body.image,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      exercises: exercises,
    };

    const updatedWorkout = await WorkoutPlan.findByIdAndUpdate(workoutId, updatedWorkoutPlan, { new: true });
    res.json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/workout-plans/:id', async (req, res) => {
  try {
    const workoutId = req.params.id;
    
    // Check if the workout plan exists
    const workoutPlan = await WorkoutPlan.findById(workoutId);
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    // Delete the workout plan
    await WorkoutPlan.findByIdAndDelete(workoutId);

    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;

module.exports = router;
