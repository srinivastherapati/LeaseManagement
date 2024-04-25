// login.js

import express  from 'express';
import bcrypt  from 'bcryptjs';
import sign  from 'jsonwebtoken';
import User from "./modules/userModel.js";

const loginRouter =express.Router();

loginRouter.post('/api/login', async (req, res) => {
    try {
        console.log("I got a request");
        console.log(req);
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(201).json({ message: 'Invalid email ' });
        }
        
        if (password!==user.password) {
            return res.status(201).json({ message: 'Invalid  password' });
        }


        res.status(200).json({ message:"User logged in successfully" ,email:user.email, isAdmin:user.isAdmin});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

loginRouter.get('/api/getAllUsers', async (req, res) => {
    try {
        // Fetch all users from the User table
        const allUsers = await User.find({}, { _id: 0, firstName: 1, email: 1 });

        // Return the list of all users with only name and email fields
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default loginRouter;
