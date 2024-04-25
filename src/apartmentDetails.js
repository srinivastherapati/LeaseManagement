import apartmentDetails from "./modules/apartmentDetailsModule.js";
import express from "express";
import bodyParser  from 'body-parser';

const apartmentDetailsRouter=express.Router();

apartmentDetailsRouter.use(bodyParser.json());
apartmentDetailsRouter.get('/api/apartmentDetails/:id',async (req,res)=>{
    const {id}=req.params;
    try{
        const apartment= await apartmentDetails.findOne({
            _id : id
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

apartmentDetailsRouter.post('/api/createApartment', async (req, res) => {
    try {

        const {
            apartmentNumber,
            flatNumber
        } = req.body;

        // Check if an apartment with the same flatNumber and apartmentNumber already exists
        const existingApartment = await apartmentDetails.findOne({ apartmentNumber, flatNumber });
        if (existingApartment) {
            return res.status(400).json({ message: 'Apartment with the same flat number and apartment number already exists' });
        }
        // Extract data from request body
        
        const {        
            images,
            thumbnails,
            amenities,
            location,
            address,
            availableFrom,
            bedrooms,
            bathrooms,
            pricePerMonth,
            description,
            ownerName,
            ownerContact
        } = req.body;

        // Create a new apartment
        const newApartment = new apartmentDetails({
            apartmentNumber,
            flatNumber,
            images,
            thumbnails,
            amenities,
            location,
            address,
            availableFrom,
            bedrooms,
            bathrooms,
            pricePerMonth,
            description,
            ownerName,
            ownerContact
        });

        // Save the new apartment to the database
        await newApartment.save();

        // Return success response
        res.status(201).json({ message: 'Apartment created successfully', apartment: newApartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
apartmentDetailsRouter.put('/api/updateApartment/:apartmentId', async (req, res) => {
    const apartmentId = req.params.apartmentId;

    try {
        // Check if the apartment exists
        const existingApartment = await apartmentDetails.findById(apartmentId);
        if (!existingApartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        // Extract data from request body
        const {
            apartmentNumber,
            flatNumber,
            images,
            thumbnails,
            amenities,
            location,
            address,
            availableFrom,
            bedrooms,
            bathrooms,
            pricePerMonth,
            description,
            ownerName,
            ownerContact
        } = req.body;

        // Update apartment fields
        if (apartmentNumber) existingApartment.apartmentNumber = apartmentNumber;
        if (flatNumber) existingApartment.flatNumber = flatNumber;
        if (images) existingApartment.images = images;
        if(thumbnails) existingApartment.thumbnails=thumbnails;
        if (amenities) existingApartment.amenities = amenities;
        if (location) existingApartment.location = location;
        if (address) existingApartment.address = address;
        if (availableFrom) existingApartment.availableFrom = availableFrom;
        if (bedrooms) existingApartment.bedrooms = bedrooms;
        if (bathrooms) existingApartment.bathrooms = bathrooms;
        if (pricePerMonth) existingApartment.pricePerMonth = pricePerMonth;
        if (description) existingApartment.description = description;
        if (ownerName) existingApartment.ownerName = ownerName;
        if (ownerContact) existingApartment.ownerContact = ownerContact;
        

        // Save the updated apartment
        await existingApartment.save();

        // Return success response
        res.json({ message: 'Apartment updated successfully', apartment: existingApartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Endpoint to delete an apartment
apartmentDetailsRouter.delete('/api/deleteApartment/:apartmentId', async (req, res) => {
    const apartmentId = req.params.apartmentId;

    try {
        // Check if the apartment exists
        const existingApartment = await apartmentDetails.findById(apartmentId);
        if (!existingApartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        // Delete the apartment
        await apartmentDetails.deleteOne({ _id: apartmentId });

        // Return success response
        res.json({ message: 'Apartment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

 
export default apartmentDetailsRouter;
