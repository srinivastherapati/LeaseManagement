import { Schema, model } from 'mongoose';

const complaintSchema = new Schema({
    complaintNumber: {
        type: String,
        required: true
    },
    complaintTitle: {
        type: String,
        required: true
    },
    complaintStatus: {
        type: String,
        required: true
    },
    complaintDateTime: {
        type: Date,
        required: true
    },
    complaintDescription: {
        type: String,
        required: true
    }
});

const schema = new Schema({
    currentComplaints: {
        type: [complaintSchema],
        default: []
    },
    previousComplaints: {
        type: [complaintSchema],
        default: []
    }
});

const Complaints = model('Complaint', schema);

export default Complaints;
