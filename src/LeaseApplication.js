import express from 'express';
import LeaseApplication from './modules/LeaseApplicationModel.js';

const leasesApplyRouter = express.Router();

// Apply for a lease
leasesApplyRouter.post('/api/applyLease', async (req, res) => {
    const { fullName, income, numberOfPeople, currentAddress } = req.body;

    try {
        // Create a new lease application object
        const newLeaseApplication = new LeaseApplication({
            fullName: fullName,
            income: income,
            numberOfPeople: numberOfPeople,
            currentAddress: currentAddress
        });

        // Save the new lease application to the database
        await newLeaseApplication.save();

        // Return success response
        res.status(200).json({ message: 'Lease application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default leasesApplyRouter;
