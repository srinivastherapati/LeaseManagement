
import express from 'express';
import availableApartments from './modules/availableApartmentsModel.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';

const availableApartmentsRouter = express.Router();


availableApartmentsRouter.get('/api/getAvailableApartments', async (req, res) => {
    try {
        // Fetch all apartments
        const apartments = await apartmentDetails.find({ isBooked: false })
        
        // Return the list of apartments as response
        res.json(apartments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default availableApartmentsRouter;
