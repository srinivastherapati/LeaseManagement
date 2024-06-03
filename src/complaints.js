

import express from 'express';
import Complaints from './modules/complaintsModel.js';
import User from './modules/userModel.js';
import { UUID } from 'mongodb';
import mongoose from 'mongoose';

const complaintsRouter = express.Router();

complaintsRouter.get('/api/getComplaints/:userId', async (req, res) => {
    const userId=req.params.userId;
    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userComplaints = await Complaints.find({ userId: userId });

        // Return complaints as response
        res.json(userComplaints);
        // // Fetch current complaints
        // const currentComplaints = await Complaints.find({}, { currentComplaints: 1, _id: 0 })

        // // Fetch previous complaints
        // const previousComplaints = await Complaints.find({}, { previousComplaints: 1, _id: 0 })

        // // Return both lists as response
        // res.json({ currentComplaints, previousComplaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


complaintsRouter.get('/api/getComplaints', async (req, res) => {
    try {
        // Populate the userId field to include name and email from the User model
        const allComplaints = await Complaints.find().populate('userId', 'firstName lastName email');

        // Transform the response to include raisedByName and raisedByEmail
        const transformedComplaints = allComplaints.map(complaint => ({
            ...complaint.toObject(),
            raisedByName: `${complaint.userId.firstName} ${complaint.userId.lastName}`,
            raisedByEmail: complaint.userId.email
        }));

        res.json(transformedComplaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

complaintsRouter.patch('/api/complaints/:complaintId', async (req, res) => {
    const complaintId = req.params.complaintId;
    const updateFields = req.body;

    try {
        // Find the complaint by ID
        const complaint = await Complaints.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Update specific fields of the complaint document
        Object.assign(complaint, updateFields);

        // Save the updated complaint
        const updatedComplaint = await complaint.save();

        res.json(updatedComplaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

complaintsRouter.post('/api/complaints/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { complaintTitle, complaintDescription, name, email,commentFromOwner } = req.body;

    try {
        // Create a new complaint object with provided fields and backend-filled fields
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user=User.findById(userId);
        if(!user){
            return res.status(404).json({message:'user does not exists'})
        }
        const newComplaint = new Complaints({
            userId: userId,
            complaintTitle: complaintTitle,
            complaintDescription: complaintDescription,
            raisedTime: new Date(),
            expectedDateToSolve: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            commentFromOwner:commentFromOwner,
            raisedByName: name,
            raisedByEmail: email
        });

        // Save the new complaint to the database
        await newComplaint.save();

        // Fetch all complaints of the user including the newly created complaint
        const userComplaints = await Complaints.find({ userId: userId });

        // Return the response of all complaints of the user
        res.json(userComplaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default complaintsRouter;
