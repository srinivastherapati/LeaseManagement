// login.js

import express  from 'express';

import Admin from '../modules/adminModel.js';

const adminLoginRouter =express.Router();

adminLoginRouter.post('api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email ' });
        }
        
        if (password!==admin.password) {
            return res.status(401).json({ message: 'Invalid  password' });
        }


        res.status(200).json({ message:"admin logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default adminLoginRouter;
