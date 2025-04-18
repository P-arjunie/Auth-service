const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register user 
exports.register = async (req, res) => {
    const {email, password, role} = req.body;
    try{
        //check whether the user already registred
        const exisitingUser = await User.findOne({email});
        if(exisitingUser)
            return res.status(400).json({message: 'User already exists'});

        //hash the pwd
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User ({email, password: hashPassword, role});
        await newUser.save();

        res.status(201).json({message: 'User registered successfully'});
    }catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
}


//login user
exports.login = async(req, res) => {
    const {email, password} = req.body;
    try{
        //find user thorugh email
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({message: 'Invalid credentials'});

        //create token
        const token = jwt.sign({userId: user._id, role: user.role}, 
            process.env.JWT_SECRET, {
                expiresIn: '1d',
        });

        res.status(200).json({token});
    }catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};
