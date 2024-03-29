const jwt=require('jsonwebtoken');
const User=require('../models/user');
const Key='VERYsecret123';
exports.isAuth=async (req,res,next)=>{
    if(req.headers && req.headers.authorization){
        const token=req.headers.authorization.split(' ')[1];
        try{
            const decode=jwt.verify(token,Key);
        const user= await User.findById(decode.userId);
        if(!user){
            return res.json({success:false, message:' Unauthorized access!'});

        }
        req.user=user;
        console.log(req.user.avatar)
        next();
        }catch(error){
            if(error.name==='JsonWebTokenError'){
             return res.json({success:false, message:' Unauthorized access token wrong!'});
            }
            if(error.name==='TokenExpiredError'){
                return res.json({success:false, message:' Session Expired!'});
               }
             
            res.json({success:false, message:' Internal Server Error!'});
        }
        
        

    }
    else{
        res.json({success:false, message:' Unauthorized access!'})
    }
}