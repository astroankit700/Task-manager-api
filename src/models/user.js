const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        unique:true,
        required:true,
        trim: true,
        lowercase:true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Please enter a valid Email id');
        },
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (/password/i.test(value)) {
                throw new Error(
                    'Your password cant contain the keyword "password"'
                );
            }
        },
    },
    tokens: [{
        token: {
            type:String,
            required:true
        }    
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
});

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid Credentials!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid Credentials');
    
    return user;
}

userSchema.methods.generateAuthToken = async function(){
    const user=this;
    const token=jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET);  //user.id is not a string but an object id

    user.tokens=user.tokens.concat({token});
    await user.save();
    
    return token;
}

//Note: Whenever res.send() operation is done on user instance of User model, 'JSON.stringify()' is operated behind the scenes so 'toJSON' method runs automatically which returns modified value of user object to stringify!
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

//MONGOOSE MIDDLEWARE
userSchema.pre('save', async function (next) {
    //can't use arrow fn bcoz it doesn't binds 'this' property
    //will work pre save
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); //is a callback function to perform next task or it will hang forever, thinking we still have to do some task before saving the user and will never save the user.
});

userSchema.pre('remove', async function(next){
    const user = this;
    // await user.populate('tasks')
    // user.tasks.forEach((task)=>task.remove());
    await Task.deleteMany({owner:user._id})

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
