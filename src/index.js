// \node Projects>  /CS/mongodb/bin/mongod.exe --dbpath=/CS/mongodb-data
// \task-manager>   npm run dev

const express = require('express');
require('./db/mongoose'); /////connecting to the mongoose

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

const port = process.env.PORT;

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

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});



/////...................HIDING PASSWORD AND TOKENS WHILE SENDING USER........................
// const obj={
//     name: 'dunno',
//     age:44
// }

// obj.toJSON = function (){
//     console.log(this);
//     return this;
// }

// console.log(JSON.stringify(obj))
// console.log(obj.toJSON())




///....................ESTABILISHING RELATIONSHIP BETWEEN USER AND TASK......................
// const User = require('./models/user');
// const Task = require('./models/task');

// const main = async () => {

// const task=await Task.findById('617171550fcd4ac2749ba558');
// await task.populate('owner')
// console.log(task);

//     const user=await User.findById('6171708f0fcd4ac2749ba550');
//     await user.populate('tasks');
//     console.log(user.tasks);
// };
// main();

