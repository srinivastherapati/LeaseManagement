
import express from 'express';
import leaseInfo from './modules/leaseInfoModel.js';
import apartmentDetails from './modules/apartmentDetailsModule.js';
import User from './modules/userModel.js';

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

leaseInfoRouter.get('/api/getAllGivenLeases', async (req, res) => {
    try {
        // Fetch all leases from the Lease table and populate the 'apartment' and 'user' fields
        const allLeases = await leaseInfo.find()
        .populate({
            path: 'User',
            select: 'firstName email annualIncome'
        })
        .populate({
            path: 'apartmentDetails',
            select: 'apartmentNumber flatNumber'
        });

        // const formattedLeases = allLeases.map(lease => ({
        //     "Apt No.": lease.apartmentDetails.apartmentNumber,
        //     "Flat no.": lease.apartmentDetails.flatNumber,
        //     Status: lease.status,
        //     "UserDetails": {
        //        " Name": lease.User.firstName,
        //         "Income": lease.User.anualIncome,
        //         "Mail": lease.User.email
        //     },
        //     Members: lease.members
        // }));

        // Return the list of all given leases
        res.json({ leases: allLeases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
leaseInfoRouter.put('/api/terminateLease/:leaseId', async (req, res) => {
    const leaseId = req.params.leaseId;

    try {
        // Find the lease by ID and update its status to "terminated"
        const updatedLease = await leaseInfo.findByIdAndUpdate(leaseId, { status: 'terminated' }, { new: true });

        if (!updatedLease) {
            return res.status(404).json({ message: 'Lease not found' });
        }

        // Fetch all leases after updating
        const allLeases = await leaseInfo.find();

        // Return the list of all leases after updating
        res.json({ leases: allLeases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

leaseInfoRouter.put('/api/transferLease/:leaseId', async (req, res) => {
    const leaseId = req.params.leaseId;
    const { newOwner } = req.body;

    try {
        // Find the lease by ID and update its owner
        const updatedLease = await leaseInfo.findByIdAndUpdate(leaseId, { owner: newOwner }, { new: true });

        if (!updatedLease) {
            return res.status(404).json({ message: 'Lease not found' });
        }

        // Fetch all leases after updating
        const allLeases = await leaseInfo.find();

        // Return the list of all leases after updating
        res.json({ leases: allLeases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

leaseInfoRouter.post('/api/removeMemberFromLease/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { removeUserId } = req.body;

    try {
        // Find the lease by user ID
        const lease = await leaseInfo.findOne({ User: userId });

        if (!lease) {
            return res.status(404).json({ message: 'Lease not found for user' });
        }
        const user=await User.findById(removeUserId);
        // Remove the specified user from the members list
        const index = lease.members.indexOf(user.email);
        if (index !== -1) {
            lease.members.splice(index, 1);
        }

        // Save the updated lease
        await lease.save();

        // Return success response
        res.json({ message: 'Member removed from lease successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

leaseInfoRouter.post('/api/addMemberToLease/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { addUserId } = req.body;

    try {
        // Find the lease by user ID
        const lease = await leaseInfo.findOne({ User: userId });

        if (!lease) {
            return res.status(404).json({ message: 'Lease not found for user' });
        }
        const user=await User.findById(addUserId);

        // Check if the user is already a member of the lease
        if (lease.members.includes(user.email)) {
            return res.status(400).json({ message: 'User is already a member of the lease' });
        }

        // Add the specified user to the members list
        lease.members.push(user.email);

        // Save the updated lease
        await lease.save();

        // Return success response
        res.json({ message: 'Member added to lease successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

leaseInfoRouter.get('/api/getUserLeaseDetails/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the lease associated with the user
        const lease = await leaseInfo.findOne({ User: userId }).populate('apartmentDetails')
        .populate('User');;

        if (!lease) {
            return res.status(404).json({ message: 'Lease not found for user' });
        }

        const { apartmentNumber, flatNumber ,images,amenities, location ,
            address ,bedrooms , bathrooms , pricePerMonth, ownerName , ownerContact } = lease.apartmentDetails;
            const{ firstName , email}=lease.User

        // Return the lease details
        res.json({
            _id: lease._id,
            apartmentDetails: {
                apartmentNumber,
                flatNumber,
                images,
                amenities,
                location,
                address,
                bedrooms,
                bathrooms,
                pricePerMonth,
                ownerName,
                ownerContact
            },
            User: {
                firstName,
                email
            },
            status: lease.status,
            members: lease.members,
            __v: lease.__v
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

leaseInfoRouter.post('/api/applyLease/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { apartmentDetailsId, members } = req.body;

    try {
        const lease = await leaseInfo.findOne({ User: userId });
        if(lease){
            return res.status(409).json({ message: 'Lease exists for user' });
        }
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the apartment details
        const apartmentData = await apartmentDetails.findById(apartmentDetailsId);
        if (!apartmentData) {
            return res.status(404).json({ message: 'Apartment details not found' });
        }

        // Create a new lease info document
        const newLeaseInfo = new leaseInfo({
            apartmentDetails: apartmentDetailsId,
            User: userId,
            status: 'Pending', // Assuming default status is pending
            members: members || [] // If members exist, assign them, otherwise assign an empty array
        });

        // Save the new lease info document
        await newLeaseInfo.save();

        // Return success response
        res.status(200).json({ message: 'Lease application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Export the router
export default leaseInfoRouter;
