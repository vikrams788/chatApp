const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Signup, instead!' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });
        const token2 = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '2d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000),
        });

        res.status(200).json({ message: 'Login successful', token2, user });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({email: email});
        
        if(existingUser) {
            res.staus(400).json({message: "User already exists. Login, instead!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({email: email, password: hashedPassword});

        await newUser.save();

        const payload = {
            userId: newUser._id,
            email: newUser.email
        }

        const token1 = jwt.sign(payload, process.env.JWT_SECRETKEY, {expiresIn: '2d'});
        const token2 = jwt.sign(payload, process.env.JWT_SECRETKEY, {expiresIn: '2d'});

        res.cookie('token', token1, {
            httpOnly: 'true',
            secure: 'true',
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000)
        });

        res.staus(200).json({message: 'User signed up and authenticated successfully', token2, newUser});
    } catch (error) {
        console.log('Error signing up: ', error);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
    
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};