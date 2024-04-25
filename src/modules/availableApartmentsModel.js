import {Schema,model} from 'mongoose';
import apartmentDetails from './apartmentDetailsModule.js';

const availableSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    apartmentDetails: {
        type:Schema.Types.ObjectId,
        ref: 'apartmentDetails',
        required: true
    },
    image: {
        type: String
    },
    availFrom: {
        type: Date,
        required: true
    }
});

const availableApartments = model('availableApartments', availableSchema);

export default availableApartments;
