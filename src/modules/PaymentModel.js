import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    transactionId: {
        type: String,
      default:"payment pending",
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
    },
    description:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
