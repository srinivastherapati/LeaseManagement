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

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Check MongoDB connection
mongoose.connect('mongodb+srv://chakri:chakri123@cluster0.bgbz3be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Rental',
 {useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true });

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
}); 



app.listen(3001,()=>{
    console.log("Server is running")
})