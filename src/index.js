import express from 'express';
import mongoose from 'mongoose';
import signupRouter from './signup.js';
import loginRouter from './login.js';
import apartmentDetailsRouter from './apartmentDetails.js';
import complaintsRouter from './complaints.js';
import availableApartmentsRouter from './availableApartments.js';
import statusRouter from './status.js';
import leaseInfoRouter from './leaseINfo.js';
import adminSignupRouter from './admin/adminSignup.js';
import adminLoginRouter from './admin/adminLogin.js';

const app=express();
mongoose.connect("mongodb+srv://chakri:chakri123@cluster0.bgbz3be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/RentalLease/lease")
const db = mongoose.connection;
app.use(signupRouter);
app.use(loginRouter);
app.use(apartmentDetailsRouter);
app.use(complaintsRouter);
app.use(availableApartmentsRouter);
app.use(statusRouter);
app.use(leaseInfoRouter);
app.use(adminSignupRouter);
app.use(adminLoginRouter);

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
}); 



app.listen(3001,()=>{
    console.log("Server is running")
})