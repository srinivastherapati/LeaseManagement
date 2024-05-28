import {Schema, model} from 'mongoose';
import apartmentDetails from './apartmentDetailsModule.js';


const leaseInfoSchema = new Schema({
    apartmentDetails: {
        type: Schema.Types.ObjectId,
        ref: 'apartmentDetails', // Reference to the ApartmentDetails model
        required: true
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    status:{
        type:String
    },
    members:{
        type:[String]
    }
});

// Define a model for the response
const leaseInfo = model('leaseInfo', leaseInfoSchema);

export default leaseInfo;
