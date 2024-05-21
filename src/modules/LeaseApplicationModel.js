import mongoose from 'mongoose';

const { Schema } = mongoose;

const leaseApplicationSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true
    },
    currentAddress: {
        type: String,
        required: true
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    apartmentNumber:{
        type:String,
        required:true
    },
    flatNumber:{
        type:String,
        required:true
    }
});

const LeaseApplication = mongoose.model('LeaseApplication', leaseApplicationSchema);

export default LeaseApplication;
