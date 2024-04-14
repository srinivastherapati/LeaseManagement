
import express from 'express';
import leaseInfo from './modules/leaseInfoModel.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';

// Create an Express router
const leaseInfoRouter = express.Router();

// Define the endpoint /api/getLeaseInfo
leaseInfoRouter.get('/api/getLeaseInfo/:flatNumber/:apartmentNumber', async (req, res) => {
    const{apartmentNumber,flatNumber}=req.params;
    try {
        const apartment= await apartmentDetails.findOne({
            apartmentNumber:apartmentNumber,
            flatNumber:flatNumber
        });
        if(!apartment){
            return res.status(404).json({message:'apartment details not found'})
        }
    
        // Fetch lease information along with apartment details
        const lease = await leaseInfo.find()
            .populate('apartmentDetails', ['apartmentNumber', 'flatNumber','ownerName','ownerContact']);

        // Return the lease information as response
        res.json(lease);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
export default leaseInfoRouter;
