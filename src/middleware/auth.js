const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // console.log('inside auth');
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})  // to make sure if the user hasn't logged out    
                    // in above line: 'tokens.token' will iterate over the entire 'tokens' array and check for the specified token

        if (!user) throw new Error();
        req.user = user;
        req.token = token;

        // console.log(user);
        next();
    } catch (e) {
        res.status(401).send('Please Authenticate!');
    }
};

module.exports = auth;
