import { Schema, model } from 'mongoose';
const apartmentDetailsSchema= new Schema({
    apartmentNumber:{
        type:String,
        required:true
    },
    flatNumber:{
        type:String,
        required:true
    },
    images: [{
        type: String,
        default: ''
    }],
    thumbnails: [{
        type: String,
        default: ''
    }],
    amenities:[ {
        type:String,
        default: ''
    }],
    location: {
        type: String,
        default: ''
    },
    address: {
        lane: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        zip: {
            type: String,
            default: ''
        }
    },
    availableFrom: {
        type: Date,
        required:true
    },
    bedrooms: {
        type: Number,
        default: 0
    },
    bathrooms: {
        type: Number,
        default: 0
    },
    pricePerMonth: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    ownerName: {
        type: String,
        default: ''
    },
    ownerContact: {
        type: String,
        default: ''
    },
    isBooked:{
        type:Boolean,
        default: false
    }

})
apartmentDetailsSchema.index({ apartmentNumber: 1, flatNumber: 1 }, { unique: true });
const apartmentDetails= model('apartmentDetails',apartmentDetailsSchema);
export default apartmentDetails;