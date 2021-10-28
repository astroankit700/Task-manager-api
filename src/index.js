// \node Projects>  /CS/mongodb/bin/mongod.exe --dbpath=/CS/mongodb-data
// \task-manager>   npm run dev
///Gadbad ho??  check AWAIT!!!!!!!!!!

const app = require('./app');

const port = process.env.PORT;
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
