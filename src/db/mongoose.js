const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{    //DEPRECATED
//     useNewUrlParser: true,
//     useCreateIndex: true
// })
mongoose.connect(process.env.MONGODB_URL); //New-version

//// Creating a constructor function for a model of user
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     age: {
//         type: Number,
//     },
//     password: {
//         type: String,
//         trim: true,
//         required: true,
//         minlength: 7,
//         validate(value) {
//             if (/password/i.test(value)) {
//                 throw new Error(
//                     'Your password cant contain the keyword "password"'
//                 );
//             }
//         },
//     },
// });

// const me = new User({
//     name: 'Ankit',
//     age: 21,
//     password: 'FDSF24PASSWORDFLDFK',
// });

// me.save()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// const Task = mongoose.model('task', {
//     description: {
//         type: String,
//     },
//     completed: {
//         type: Boolean,
//     },
// });

// const task1 = new Task({
//     description: 'Clean the porch',
//     completed: true
// });

// task1
//     .save()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.log(error);
//     });
