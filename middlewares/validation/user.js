const {check,validationResult}=require('express-validator');

exports.validateUserSignup=[
    check('name').trim().not().isEmpty().withMessage('Name is required!').isAlpha().withMessage('Must be a valid name!').
    isLength({min:3, max:20}).withMessage
    ('Name must be within 3 to 20 characters!'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid Email!'),
    check('password').trim().not().isEmpty().withMessage('Password is empty!').
    isLength({min:8, max:20}).withMessage
    ('Password must be within 8 to 20 characters long!'),
    check('confirmPassword').trim().not().isEmpty().custom((value,{req})=>{
      if(value!==req.body.password){
        throw new Error('Password didn"t match!')
      }
      return true;
    })
]


exports.userValidation=(req,res,next)=>{
  const result=  validationResult(req).array();
  if(!result.length) return next();
  const error=result[0].msg;
  res.json({success:false, message:error})
}


exports.validateUserSignIn=[
  check('email').trim().isEmail().withMessage('Email/password is required!'),
  check('password').trim().not().isEmpty().withMessage('Email/password is required!')

]