const express=require('express');
const router=express.Router();
const {createUser, userSignIn, uploadProfile, signOut}=require('../controllers/user');
const { validateUserSignup, userValidation, validateUserSignIn } = require('../middlewares/validation/user');
const { isAuth } = require('../middlewares/auth');
const User=require('../models/user');
const cloudinary = require('../helper/imageUpload');
const workoutProgress=require('../models/user')
const sharp=require('sharp');
const multer=require('multer');
const WorkoutPlan = require('../models/workout');
const bcrypt=require('bcrypt')
const storage=multer.diskStorage({});
const fileFilter=(req,file,cb)=>{
if(file.mimetype.startsWith('image')){
    cb(null,true);
}else{
    cb('ivalid image file!',false);
}
}
const uploads= multer({storage,fileFilter});


router.post('/signup',validateUserSignup,userValidation,createUser);
router.post('/signin',validateUserSignIn,userValidation,userSignIn);
router.post('/upload-profile',isAuth,uploads.single('profile'),uploadProfile),
router.get('/sign-out',isAuth,signOut);
router.post('/resetPassword', async (req, res,next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If the user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
   
      
    const hash=  await  bcrypt.hash(password ,8)
    // Update user's password and confirmPassword with the new password
    //const hashedPassword = await bcrypt.hash(password, 8);
    user.password = hash;
    user.confirmPassword = password;

    // Save the updated user data
    await user.save();

    // Respond with a success message or updated user data
    res.json({ message: 'Password reset successfully', user });
  } catch (error) {
    // Handle errors, such as database issues
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
     router.get('/profile',isAuth,(req,res)=>{
      
      if(!req.user)
      return res.json({success:false,message:'unauthorized success!'});

    res.json({
      success:true,
      
      
        
        avatar:req.user.avatar,
        user:req.user,
      
    })
     })
router.post('/posts/:id', uploads.single('postImage'), async (req, res) => {
  const userId=req.params.id
  //console.log(req.body.postStatus)
 // console.log(req.body.avatar)

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create a new social media post
    const newPost = {
      postImage: result.secure_url,
      postCaption: req.body.postCaption,
      postPublic: req.body.postStatus ,
      avatar:req.body.avatar,
      name:req.body.name
    };
//console.log(result)
    // Save the post to the user's socialPosts array
   // const user = await User.findById(userId); // Assuming you have a user object in your request (req.user)
   // user.socialPosts.push(newPost);
   const user= await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { socialPosts: [newPost]}},
      { new: true }
    );
    //console.log(user)
    await user.save();
   
    // You can also save the post to a workout plan if needed
    // const workoutPlan = await WorkoutPlan.findById(req.body.workoutPlanId);
    // workoutPlan.socialPosts.push(newPost);
    // await workoutPlan.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating social media post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/editProfile/:id', async(req, res)=>{

  const userId = req.params.id;
  const name = req.body; // Assuming you send updated data from the front end in the request body
 // console.log(userId)
 // console.log(name)
  
  try {
      // Find the user by ID in the database
      const user = await User.findOneAndUpdate(
          { _id: userId },
          { $set: name }, // Update user data with the data from the request body
          { new: true } // This option returns the updated document
      );

      // If the user is not found, return a 404 response
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respond with a success message or updated user data
      res.json({ message: 'User profile updated successfully', user });
  } catch (error) {
      // Handle errors, such as database issues
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  } 
})
router.post('/upload-post',uploads.single() ,async (req, res) => {
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
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

router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/users/:id/unblock', async (req, res) => {
    const userId = req.params.id;
  
    try {
        // Find the user by ID in the database
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { blocked: false } },
            { new: true } // This option returns the updated document
        );

       
        // If the user is not found, return a 404 response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Update the user's blocked status to false
        user.blocked = false;
  
        // Save the updated user in the database
        await user.save();
  
        // Respond with a success message or updated user data
        res.json({ message: 'User unblocked successfully', user });
    } catch (error) {
        // Handle errors, such as database issues
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.put('/users/:id/block', async (req, res) => {
    const userId = req.params.id;
 
    try {
      // Find the user by ID in the database
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { blocked: true } },
        { new: true } // This option returns the updated document
      );
     // console.log(userId)
      
      // If the user is not found, return a 404 response
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's blocked status to true
      user.blocked = true;
  
      // Save the updated user in the database
      await user.save();
  
      // Respond with a success message or updated user data
      res.json({ message: 'User blocked successfully', user });
    } catch (error) {
      // Handle errors, such as database issues
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    try {
        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);

        if (deletedUser) {
            res.json({ message: 'User deleted successfully', user: deletedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/custom-workout/:id', async (req, res) => {
  const userId = req.params.id;
 // console.log(userId);
   
  const { planName, planDuration, exerciseData } = req.body;
  
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          customWorkout: {
            planName: planName,
            planDuration: planDuration,
            exercises: exerciseData || [], // Default to an empty array if exercisesData is not provided
          },
        },
      },
      { new: true }
    );

    //console.log(user);

    await user.save();
    //console.log('User saved successfully.');
    res.json({ message: 'User saved successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/workout-progress/:id', async (req, res) => {
  const userId = req.params.id;
  const { workoutPlanId, progress, calories } = req.body;
  let user;
//  console.log(workoutPlanId)
  // console.log(userId)
  // console.log(progress)
  try {
    // Find the user by ID
   

    // Find the workout plan by ID
    const workoutPlan = await WorkoutPlan.findById(workoutPlanId);
   // console.log(workoutPlan)
    // Check if the workout plan exists
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }
    const existingWorkoutPlan = await User.findOne({
      _id: userId,
      workoutPlans: { $elemMatch: { workoutPlan: workoutPlanId } }
    });
    
    if (existingWorkoutPlan) {
      // If the workoutPlan exists, update its progress
       user = await User.findOneAndUpdate(
        {
          _id: userId,
          'workoutPlans.workoutPlan': workoutPlanId
        },
        {
          $inc: { 'workoutPlans.$.progress': progress,
                  'workoutPlans.$.calories': calories},
          $push: { 'workoutPlans.$.dates':  [new Date()] }
        },
        { new: true }
      );
    } else {
      // If the workoutPlan doesn't exist, add a new workoutPlan with the specified progress
       user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { workoutPlans: { workoutPlan: workoutPlanId,workoutName:workoutPlan.name, progress: progress,calories: calories,duration:workoutPlan.duration,dates: [new Date()] } }
        },
        { new: true }
      );
    }
  //   console.log(user)
    // Check if the user exists
   // if (!user) {
   //   return res.status(404).json({ message: 'User not found' });
  //  }

    // Update workout progress
   // const existingWorkoutProgress = user.workoutProgress.find(
     // (wp) => wp.workoutPlan.toString() === workoutPlanId
   // );
  //  user.blocked=true;
     // user.workoutPlans.push({ workoutPlan: workoutPlanId, progress });
    console.log(user)

    // Save the updated user
    
    
      await user.save();
      //console.log('User saved successfully.');
      res.json({ message: 'User saved successfully', user });
  
    

    // Respond with a success message or updated user data
   // console.log('User saved successfully.');
  res.json({ message: 'User saved successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/custom-workout/:id', async (req, res) => {
  const userId = req.params.id;
  // console.log(userId)
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming 'customWorkout' is an array field in your User model
    const customWorkoutArray = user.customWorkout || [];
//console.log(customWorkoutArray)
    res.json( customWorkoutArray );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/posts/:id', async (req, res) => {
  const userId = req.params.id;
  // console.log(userId)
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming 'customWorkout' is an array field in your User model
    const posts = user.socialPosts || [];
//console.log(posts)
    res.json( posts );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


 module.exports=router