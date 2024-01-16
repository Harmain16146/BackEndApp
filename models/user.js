const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const workoutProgressSchema = new mongoose.Schema({
  workoutPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  },
  progress: {
    type: Number,
    default: 0 // Set the default progress to 0
  }
});
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
  
  },
  email: {
    type: String,
    required: true,
  
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Set the default value to the current timestamp when the document is created
  },
  blocked: {
    type: Boolean,
    default: false // By default, the user is not blocked
  },
  avatar: {
    type: String
  },
  tokens:[{type:Object}],
  weight: {
    type: String
  },
  height: {
    type: Number
  },
  goal:{
    type:String
  },
  gender:{
    type:String
  },
  socialPosts:[
    {
      postImage:{
        type:String
      },
      postCaption:{
        type:String
      },
      postPublic:{
        type:Boolean,
        default:true
      },
      avatar:{
        type:String
      },
      name:{
        type:String
      }

    }
  ],

  customWorkout:[
{
  planName:{
    type:String,
    required: false,
  },
  planDuration:{
    type:String,
    required: false,
  },
  exercises: [],
  
}
  ],

  workoutPlans: [{
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
    workoutName: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      defualt: 100,
    },
    duration:{
       type: Number,
       defualt: 30,
    },
    dates: [
      {
        type: Date,
        default: Date.now,
      },
    ],

  }],
});

userSchema.pre('save',function(next){
  if(this.isModified('password' && 'confirmPassword')){
    bcrypt.hash(this.password && this.confirmPassword,8,(err,hash)=>{
      if(err) return next(err);
      this.password=hash;
      this.confirmPassword=hash;
      next();

    })
  }
})

userSchema.methods.comparePassword=async function(password){
  if(!password) throw new Error('Password is missing, cannot compare');
  try{
   const result= await bcrypt.compare(password,this.password);
   return result;
  } catch(error){
    console.log('Error while comparing password',error.message);
  }
}


userSchema.statics.isThisEmailInUse= async function (email){
  if(!email) throw new Error('Invalid Email');
  try{
      const user = await this.findOne({email})
      if(user) return false
      return true;

  }catch(error){
  console.log("Error inside this isThisEmailInUse method",error.message)
  return false;
  }
}

const User = mongoose.model('User', userSchema);
module.exports=workoutProgressSchema
module.exports = User;
