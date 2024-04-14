

import express from 'express';
import Complaints from './modules/complaintsModel.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';

const complaintsRouter = express.Router();

complaintsRouter.get('/api/complaints/:flatNumber/:apartmentNumber', async (req, res) => {
    const{apartmentNumber,flatNumber}=req.params;
    try {
        const apartment= await apartmentDetails.findOne({
            apartmentNumber:apartmentNumber,
            flatNumber:flatNumber
        });
        if(!apartment){
            return res.status(404).json({message:'apartment details not found'})
        }
        // Fetch current complaints
        const currentComplaints = await Complaints.find({}, { currentComplaints: 1, _id: 0 })

        // Fetch previous complaints
        const previousComplaints = await Complaints.find({}, { previousComplaints: 1, _id: 0 })

        // Return both lists as response
        res.json({ currentComplaints, previousComplaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default complaintsRouter;
