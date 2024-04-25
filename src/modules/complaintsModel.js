import { Schema, model } from 'mongoose';

const complaintSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    complaintTitle: {
        type: String,
        required: true
    },
    complaintStatus: {
        type: String
    },
    complaintDescription: {
        type: String,
        required: true
    },
    raisedTime: {
        type: Date
    },
    expectedDateToSolve: {
        type: Date
    },
    commentFromOwner:{
        type:String
    },
    raisedByName:{
        type:String
    },
    raisedByEmail:{
        type:String
    }

});

// const schema = new Schema({
//     currentComplaints: {
//         type: [complaintSchema],
//         default: []
//     },
//     previousComplaints: {
//         type: [complaintSchema],
//         default: []
//     }
// });

const Complaints = model('Complaint', complaintSchema);

export default Complaints;
