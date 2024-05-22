import {Schema,model} from 'mongoose';
import apartmentDetails from './apartmentDetailsModule.js';

const statusSchema = new Schema({
    hasApplied: {
        type: Boolean,
        required: true
    },
    applicationNumber: {
        type: String,
        required: true
    },
    apartmentDetails: {
        type: Schema.Types.ObjectId,
        ref: apartmentDetails,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
      //  required: true
    },
    status: {
        type: String,
        required: true
    }
});

const StatusModel = model('Status', statusSchema);

export default StatusModel;
