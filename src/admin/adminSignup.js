

import express from "express";
import bodyParser  from 'body-parser';
import Admin from "../modules/adminModel.js";

const adminSignupRouter=express.Router();

adminSignupRouter.use(bodyParser.json());

adminSignupRouter.post('/api/admin/signup', async (req, res) => {
    try {
        const { firstName,lastName, email, password,phoneNumber } = req.body;

        // Check if admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create a new Admin
        const newAdmin = new Admin({ firstName,lastName, email, password,phoneNumber });
        await newAdmin.save();
        res.status(201).json({ message: "admin signed up successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default adminSignupRouter;