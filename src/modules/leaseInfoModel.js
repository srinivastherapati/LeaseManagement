import {Schema, model} from 'mongoose';
import apartmentDetails from './apartmentDetailsModule.js';


const leaseInfoSchema = new Schema({
    apartmentDetails: {
        type: Schema.Types.ObjectId,
        ref: apartmentDetails,
        required: true
    },
    leaseStartDate: {
        type: Date,
        required: true
    },
    leaseEndDate: {
        type: Date,
        required: true
    },
    rentPerMonth: {
        type: Number,
        required: true
    }
});

// Define a model for the response
const leaseInfo = model('leaseInfo', leaseInfoSchema);

export default leaseInfo;
