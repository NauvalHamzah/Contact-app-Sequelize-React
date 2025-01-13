import fs from 'fs';
import path from 'path';
import db from '../models/index.js';  // Import models
import { Op } from 'sequelize';
import deleteAvatar from '../helpers/deleteAvatar.js';

const { Contact } = db;

const getAllContacts =  async (req, res) => {
  const { page = 1, limit = 20, sort = 'name', order = 'ASC', filter = '' } = req.query;

  try {
    const contacts = await Contact.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${filter}%`
            }
          },
          {
            phone: {
              [Op.like]: `%${filter}%`
            }
          }
        ]
      },
      order: [[sort, order]], // Sorts by specified field
      limit: parseInt(limit), // Limits the number of results
      offset: (page - 1) * limit, // Skips records for pagination
    });

    res.json({
      total: contacts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      contacts: contacts.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// Create a new contact
const createContact = async (req, res) => {
  try {
    const { name, phone, avatar = null } = req.body;
    const newContact = await Contact.create({ name, phone, avatar });
    console.log('Created Contact:', newContact);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

// Update a contact
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, avatar = null } = req.body;
    const [updated] = await Contact.update({ name, phone, avatar }, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

// Delete a contact
const deleteContact = (PORT) => async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Check if avatar exists (is not null) and delete it
    await deleteAvatar(PORT, contact.avatar);

    // Delete the contact
    await Contact.destroy({ where: { id } });

    res.status(200).json({ message: 'Contact and avatar deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

// Update avatar
const updateAvatar = (PORT) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    // Get the file path
    const avatarPath = `http://localhost:${PORT}/${req.file.path}`;
    
    // Update user avatar in the database
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (contact.avatar) {
      await deleteAvatar(PORT, contact.avatar);
    }

    contact.avatar = avatarPath;
    await contact.save();

    res.status(200).json({
      message: 'Avatar updated successfully!',
      avatar: avatarPath
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { getAllContacts, createContact, updateContact, deleteContact, updateAvatar };
