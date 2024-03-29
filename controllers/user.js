const User= require('../models/user');
const jwt=require('jsonwebtoken');
const cloudinary=require('../helper/imageUpload')
const Key='VERYsecret123';
const sharp=require('sharp');
exports.createUser=async(req,res)=>{
const { name, email, password, confirmPassword,selectedGender,selectedGoal,userWeight,userAge} = req.body;
console.log(name,email,password,selectedGender,selectedGoal,userWeight,userAge);
    const isNewUser= await User.isThisEmailInUse(email);
    if(!isNewUser) return res.json({
        success:false,
        message:'This email is already in use, try sign-in',
    });
    
    const user=await User({
        name,
        email,
        password,
        confirmPassword,
        age:userAge,
        weight:userWeight,
        goal:selectedGoal,
        gender:selectedGender,
        createdAt: new Date()
    })
    await user.save();
    res.json({success: true,user});
 }

 exports.userSignIn= async(req,res)=>{
    const {email, password}=req.body;
    const user= await User.findOne({email});
    if(!user) return res.json({success:false, message:'User not found with this email!'});

    const isMatch=await user.comparePassword(password);

    if(!isMatch) return res.json({success:false, message:'Email or password is incorrect!'});


    const token=jwt.sign({
        userId: user._id},Key,{
            expiresIn:'1d',
        }
    )
    let oldTokens=user.tokens || []
        if(oldTokens.length){
          oldTokens= oldTokens.filter(t=>{
             const timeDiff= (Date.now()-parseInt(t.signedAt))/1000;
             if(timeDiff < 86400){
              return t;
             }
           })
        }
        await User.findByIdAndUpdate(user._id,{tokens:[...oldTokens,{token,signedAt:Date.now().toString() }],
    })
 
 
        res.json({success:true, user,token});
    }

 exports.uploadProfile=async (req,res)=>{
    const {user}=req;
    if(!user) return res.status(401).json({success:false, message:'Unauthorized success!'});
    
    //cloudaniry task//
  
    
    try{
        const result=await cloudinary.uploader.upload(req.file.path,{
            public_id:`${user._id}_profile`,
            width:500,
            height:500,
            crop:'fill'
        })
        const updatedUser =await User.findByIdAndUpdate(user._id,{avatar:result.url});
  res.status(201).json({success:true, message:'Profile Updated!',user: updatedUser,avatar:result.url });
   }
   catch(error){
    res.status(500).json({success:false, message:'Profile cannot update due to server!'});
    console.log("Error while uploading",error.message);}

} 

exports.signOut= async(req,res)=>{
    if(req.headers && req.headers.authorization){
       const token= req.headers.authorization.split(' ')[1]
        if(!token){
            res.status(401).json({success:false,message:' Authorization Fail'})
        }

        const tokens=req.user.tokens
        const newTokens=tokens.filter(t=>t.token !== token)
        await User.findByIdAndUpdate(req.user._id, {tokens:newTokens})
        res.json({success:false,message:'Sign Out Successfully'})
    }
}