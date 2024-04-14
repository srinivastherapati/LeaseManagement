// login.js

import express  from 'express';
import bcrypt  from 'bcryptjs';
import sign  from 'jsonwebtoken';
import User from "./modules/userModel.js";

const loginRouter =express.Router();

loginRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email ' });
        }
        
        if (password!==user.password) {
            return res.status(401).json({ message: 'Invalid  password' });
        }


        res.status(200).json({ message:"User logged in successfully" ,email:user.email, isAdmin:user.isAdmin});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default loginRouter;
