// status.js

import express from 'express';
import StatusModel from './modules/statusSchema.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';
import leaseInfo from './modules/leaseInfoModel.js';

const statusRouter = express.Router();

// GET /api/status
statusRouter.get('/api/getStatus/:userId', async (req, res) => {
    const{userId}=req.params;
    try {
        // const apartment= await apartmentDetails.findOne({
        //     apartmentNumber:apartmentNumber,
        //     flatNumber:flatNumber
        // });
        // if(!apartment){
        //     return res.status(404).json({message:'apartment details not found'})
        // }

        const lease = await leaseInfo.findOne({ User: userId });
        if(!lease){
            return res.status(404).json({ message: 'lease does not exists for user' });
        }
        const apartmentDetailsId=lease.apartmentDetails._id;
    
        const statusData = await StatusModel.findOne({apartmentDetails:apartmentDetailsId})
        .populate('apartmentDetails', ['apartmentNumber', 'flatNumber','ownerName','ownerContact']);;

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
            .populate('apartmentDetails', 'apartmentNumber flatNumber') 
            .select('apartmentDetails status'); 

        if (!statusData || statusData.length === 0) {
            return res.status(404).json({ message: 'Status data not found' });
        }
        const apartmentDetailsIds = statusData.map(status => status.apartmentDetails._id);

        const leaseInfoData = await leaseInfo.find({ apartmentDetails: { $in: apartmentDetailsIds } })
        .populate('User', 'firstName lastName email phoneNumber annualIncome') // Populate the userName from User model
        .select('apartmentDetails User');

        const result = statusData.map(status => {
            const leaseInfo = leaseInfoData.find(lease => lease.apartmentDetails.toString() === status.apartmentDetails._id.toString());
            return {
                apartmentNumber: status.apartmentDetails.apartmentNumber,
                flatNumber: status.apartmentDetails.flatNumber,
                status: status.status,
                userName: leaseInfo ? `${leaseInfo.User.firstName} ${leaseInfo.User.lastName}` : null,
                email: leaseInfo ? leaseInfo.User.email : "emagf",
                phoneNumber: leaseInfo ? leaseInfo.User.phoneNumber : "kjhgfd",
                income: leaseInfo ? leaseInfo.User.annualIncome : "jhgfd"
            };
        });

        res.json(result);


      
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default statusRouter;
