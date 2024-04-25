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
import leasesApplyRouter from './LeaseApplication.js';
import paymentsRouter from './payments.js';
import cors from 'cors'
const app=express();
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
app.use(leasesApplyRouter);
app.use(paymentsRouter);
const corsOptions = {
    origin: 'http://localhost:3001', // Allow only your React app domain
    methods: ['GET', 'POST', 'OPTIONS'], // Methods allowed in the CORS request
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed in CORS requests
    credentials: true, // This allows the server to accept the cookie sent from the client
    optionsSuccessStatus: 200 // For legacy browser support
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); 
// Check MongoDB connection
mongoose.connect('mongodb+srv://chakri:chakri123@cluster0.bgbz3be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Rental', { useNewUrlParser: true, useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
}); 



app.listen(3001,()=>{
    console.log("Server is running")
})