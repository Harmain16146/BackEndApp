console.log('Hello bai')
const express=require('express');
const app=express();
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' }));

require('./db');
const Workout=require('./models/workout');

app.get('/',(req,res)=>{
    res.send('<h1>Homepage</h1>');
})
const workoutRouter = require("./routes/workout")
const User=require('./models/user');
const userRouter= require('./routes/user')
const dietRouter=require('./routes/diet')
const motivation = require("./routes/motivation")
const post=require('./routes/post')
//app.use((req,res,next)=>{
   // req.on('data', chunk =>{
     //   const data=JSON.parse(chunk);
      //  req.body=data;
      //  next();
   // })
  // })
  app.use(express.json());
  app.use(workoutRouter);
  app.use(userRouter);
  app.use(dietRouter)
  app.use(motivation)
  app.use(post)
app.listen(8000,()=>{
    console.log("Server started");
})