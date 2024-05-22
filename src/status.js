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

statusRouter.put('/api/updateStatus/:flatNumber/:apartmentNumber', async (req, res) => {
    const { apartmentNumber, flatNumber } = req.params;
    const { status } = req.body;

    try {
        // Find the apartment by apartmentNumber and flatNumber
        const apartment = await apartmentDetails.findOne({
            apartmentNumber: apartmentNumber,
            flatNumber: flatNumber
        });

        if (!apartment) {
            return res.status(404).json({ message: 'Apartment details not found' });
        }

        // Find the status data associated with the apartment
        const statusData = await StatusModel.findOne({
            apartmentDetails: apartment._id // assuming apartmentDetails field in StatusModel holds the reference to apartmentDetails document
        });

        if (!statusData) {
            return res.status(404).json({ message: 'Status data not found' });
        }

        // Update the status and progress based on the new status
        statusData.status = status;
        switch (status) {
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
                statusData.progress = 0;
        }

        // Save the updated status data
        await statusData.save();

        // Return the updated status data as response
        res.json(statusData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

statusRouter.get('/api/getAllStatus', async (req, res) => {
    try {
        
    
        const statusData = await StatusModel.find()

        if (!statusData) {
            return res.status(404).json({ message: 'Status data not found' });
        }
        // switch (statusData.status) {
        //     case 'applied':
        //         statusData.progress = 20;
        //         break;
        //     case 'underReview':
        //         statusData.progress = 40;
        //         break;
        //     case 'partiallyApproved':
        //         statusData.progress = 60;
        //         break;
        //      case 'verified':
        //         statusData.progress = 80;
        //         break;
        //     case 'approved':
        //         statusData.progress = 100;
        //         break;
        //      case 'declined':
        //          statusData.progress = 100;
        //         break;
        //     default: 
        //     statusData.progress = 100;
                
        // }

        // Return the status data as response
        res.json(statusData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default statusRouter;
