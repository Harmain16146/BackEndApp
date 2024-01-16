const express=require('express');
const router=express.Router();
const {createUser, userSignIn, uploadProfile}=require('../controllers/user');
const { validateUserSignup, userValidation, validateUserSignIn } = require('../middlewares/validation/user');
const { isAuth } = require('../middlewares/auth');
const User=require('../models/user');
const cloudinary = require('../helper/imageUpload');
const workoutProgress=require('../models/user')
const sharp=require('sharp');
const multer=require('multer');
const WorkoutPlan = require('../models/workout');
const Post=require('../models/post')
const storage=multer.diskStorage({});
const fileFilter=(req,file,cb)=>{
if(file.mimetype.startsWith('image')){
    cb(null,true);
}else{
    cb('ivalid image file!',false);
}
}
const uploads= multer({storage,fileFilter});
router.post('/social', uploads.single('postImage'), async (req, res) => {
    console.log(req.body.name)
    //console.log(req.body.postStatus)
   // console.log(req.body.avatar)
  
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // Create a new social media post
      const newPost =new Post ({
        postImage: result.secure_url,
        postCaption: req.body.postCaption,
        postPublic: req.body.postStatus ,
        avatar:req.body.avatar,
        name:req.body.name,
        userId:req.body.id
      });
  console.log(newPost)
      // Save the post to the user's socialPosts array
     // const user = await User.findById(userId); // Assuming you have a user object in your request (req.user)
     // user.socialPosts.push(newPost);
    
      await newPost.save();
     
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

  router.get('/social/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Fetch user posts based on the provided user ID
      const userPosts = await Post.find({ userId });
  
      res.status(200).json(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/social', async (req, res) => {
    try {
      // Fetch all posts from the database
      const allPosts = await Post.find();
  
      res.status(200).json(allPosts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports=router