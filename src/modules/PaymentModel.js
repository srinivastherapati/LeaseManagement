import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    bankNumber: {
        type: String,
        required: true
    },
    routerNumber: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status:{
        type:String,
        default:"pending"
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
