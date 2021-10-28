const express = require('express');
require('./db/mongoose'); /////connecting to the mongoose

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// EXPRESS MIDDLEWARE......................................

// app.use((req,res,next)=>{
//     res.status(503).send("The site is currently under maintainence. Please try back soon!!");
// })

// app.use((req,res,next)=>{
//     if(req.method=="GET"){
//         res.send('GET methods are currently disabled!!')
//     } else{
//         next();
//     }
// })

//.........................................................

app.use(express.json()); // parses the incoming json request
app.use(userRouter); //loading and using the user route in application    i.e. registering user router with express application
app.use(taskRouter); //loading and using the task route in application

module.exports = app