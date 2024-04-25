// status.js

import express from 'express';
import StatusModel from './modules/statusSchema.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';

const statusRouter = express.Router();

// GET /api/status
statusRouter.get('/api/getStatus/:flatNumber/:apartmentNumber', async (req, res) => {
    const{apartmentNumber,flatNumber}=req.params;
    try {
        const apartment= await apartmentDetails.findOne({
            apartmentNumber:apartmentNumber,
            flatNumber:flatNumber
        });
        if(!apartment){
            return res.status(404).json({message:'apartment details not found'})
        }
        // const matchingApartment = await apartmentDetails.findOne({
        //     _id: apartment._id, // Match by the ObjectId of the found apartment
        //     apartmentNumber: apartmentNumber,
        //     flatNumber: flatNumber
        // });
        
        // if (!matchingApartment) {
        //     return res.status(400).json({ message: 'apartmentNumber and flatNumber do not belong to the same apartmentDetails' });
        // }
        // Fetch status data
        const statusData = await StatusModel.findOne()
        .populate('apartmentDetails', ['apartmentNumber', 'flatNumber','ownerName','ownerContact']);

        if (!statusData) {
            return res.status(404).json({ message: 'Status data not found' });
        }
        switch (statusData.status) {
            case 'applied':
                statusData.progress = 20;
                break;
            case 'underReview':
                statusData.progress = 40;
                break;
            case 'partiallyApproved':
                statusData.progress = 60;
                break;
             case 'verified':
                statusData.progress = 80;
                break;
            case 'approved':
                statusData.progress = 100;
                break;
             case 'declined':
                 statusData.progress = 100;
                break;
            default: 
            statusData.progress = 100;
                
        }

        // Return the status data as response
        res.json(statusData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// statusRouter.put('/api/updateApartmentStatus/:flatNumber/:apartmentNumber', async (req, res) => [
//     try{
//         const {status}=req.

//     }
// ])

export default statusRouter;
