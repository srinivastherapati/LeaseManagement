import apartmentDetails from "./modules/apartmentDetailsModule.js";
import express from "express";
import bodyParser  from 'body-parser';

const apartmentDetailsRouter=express.Router();

apartmentDetailsRouter.use(bodyParser.json());
apartmentDetailsRouter.get('/api/apartmentDetails/:flatNumber/:apartmentNumber',async (req,res)=>{
    const{apartmentNumber,flatNumber}=req.params;
    try{
        const apartment= await apartmentDetails.findOne({
            apartmentNumber:apartmentNumber,
            flatNumber:flatNumber
        });
        if(!apartment){
            return res.status(404).json({message:'apartment not found with given details'})
        }
        res.json(apartment);

    }
    catch(error){
        res.status(500).json({message:'Internal server error'});
    }
});
 
export default apartmentDetailsRouter;
