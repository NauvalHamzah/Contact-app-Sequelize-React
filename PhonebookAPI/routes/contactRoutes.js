import express from 'express'; 
import upload from '../config/multerConfig.js'; 
import { getAllContacts, createContact, updateContact, deleteContact, updateAvatar } from '../controllers/contactController.js';

const router = express.Router();

const contactRoutes = (PORT) => {
    router.get('/', getAllContacts);
    router.post('/', createContact); 
    router.put('/:id', updateContact); 
    router.delete('/:id', deleteContact(PORT)); 
    router.put('/:id/avatar', upload.single('avatar'), updateAvatar(PORT)); 

    return router;
}

export default contactRoutes; 