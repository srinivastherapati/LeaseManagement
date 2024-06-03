import express from 'express';
import Payment from './modules/PaymentModel.js'
import leaseInfo from './modules/leaseInfoModel.js';
import User from './modules/userModel.js';

const paymentsRouter = express.Router();

paymentsRouter.post('/api/payments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { bankNumber, routerNumber, amount , description } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const activeLease = await leaseInfo.findOne({ User: userId, status: 'Active' });
        if (!activeLease) {
            return res.status(400).json({ message: 'User does not have an active lease' });
        }

        // Generate a random transactionId
        const transactionId = Math.random().toString(36).substring(7);

        // Create a new payment
        const payment = new Payment({
            user: userId,
            bankNumber,
            routerNumber,
            amount,
            transactionId,
            status: 'Paid',
            description
        });

        // Save the payment to the database
        await payment.save();

        // Return success response
        res.status(201).json({ message: 'Payment successful', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

paymentsRouter.get('/api/getAllRequiredPayments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has an active lease
        const activeLease = await leaseInfo.findOne({ User: userId, status: 'Active' });
        if (!activeLease) {
            return res.status(200).json({ message: 'User is not on any lease right now', payments: [] });
        }

        // Retrieve all payments for the active lease
        const requiredPayments = await Payment.find({ user: userId }).populate('user', 'email');;

        // Return the list of payments
        res.status(200).json({ message: 'Success', payments: requiredPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
paymentsRouter.get('/api/getAllRequiredPayments', async (req, res) => {
    try {
        
        // Retrieve all payments for the active lease
        const requiredPayments = await Payment.find().populate('user', 'email');

        // Return the list of payments
        res.status(200).json({ message: 'Success', payments: requiredPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

paymentsRouter.put('/api/updatePayment/:id', async (req, res) => {
    try {
        
        // Retrieve all payments for the active lease
        const {id}=req.params;
        const {status,transactionId}=req.body;
        const payment= await Payment.findById(id);
        const existingTransactionId=await Payment.find({transactionId:transactionId});
        console.log( existingTransactionId );
        if(existingTransactionId && existingTransactionId.length > 0){
            return res.status(409).json({ message: 'payment with transaction id already exists'});
        }
        if(!payment){
            return res.status(200).json({ message: 'no payments founds'});
        }

        payment.transactionId = transactionId;
        payment.status=status;
         await payment.save();
         const updatedPayments = await Payment.find({user : payment.user}).populate('user', 'email');

         // Return the list of payments
         res.status(200).json({ message: 'Success', payments: updatedPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});





export default  paymentsRouter;
