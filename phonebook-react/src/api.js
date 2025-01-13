import axios from 'axios';

const API_URL = 'http://localhost:3001/api/phonebooks'; // Update with your backend URL

// Fetch all contacts
export const getContacts = async ({ filter = '', limit = 25, sort = 'name', order = 'ASC', page = 1, }) => {
  try {
    const response = await axios.get(`${API_URL}/`,{
      params: {
        filter, // Pass the filter (search term) to the backend
        limit,
        sort,
        order,
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
};

// Fetch a single contact
export const getContact = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  };

// Create a new contact
export const createContact = async (contact) => {
  console.log(contact)
  try {
    const response = await axios.post(`${API_URL}/`, contact);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
  }
};

// Update an existing contact
export const updateContact = async (id, contact) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, contact);
    return response.status;
  } catch (error) {
    console.error('Error updating contact:', error);
  }
};

// Delete a contact
export const deleteContact = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
};


// Update an existing contact avatar
export const updateAvatar = async (id, contact) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/avatar`, contact);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };