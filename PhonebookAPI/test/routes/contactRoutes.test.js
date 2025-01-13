import { expect } from 'chai';
import request from 'chai-http';
import app from '../../app.js'; // Import your Express app

const api = request(app); // Chai HTTP

describe('Contact Routes', function () {
  let createdContactId;

  afterEach(async function () {
    // Clean up test data after each test
    await db.Contact.destroy({ where: {}, truncate: true }); // Delete all contacts
  });

  // Test POST /contacts - Create a new contact
  it('should create a new contact', async function () {
    const res = await api.post('/contacts').send({
      name: 'John Doe',
      phone: '1234567890',
      avatar: 'johndoe.jpg',
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('name', 'John Doe');
    expect(res.body).to.have.property('phone', '1234567890');
    expect(res.body).to.have.property('avatar', 'johndoe.jpg');
    createdContactId = res.body.id;  // Save the created contact ID for further tests
  });

  // Test GET /contacts - Fetch all contacts
  it('should get all contacts', async function () {
    const res = await api.get('/contacts');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.contacts).to.be.an('array');
    expect(res.body.total).to.be.a('number');
  });

  // Test GET /contacts/:id - Get a specific contact by ID
  it('should get a contact by ID', async function () {
    const res = await api.get(`/contacts/${createdContactId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', createdContactId);
    expect(res.body).to.have.property('name');
    expect(res.body).to.have.property('phone');
  });

  // Test PUT /contacts/:id - Update a contact by ID
  it('should update a contact by ID', async function () {
    const res = await api.put(`/contacts/${createdContactId}`).send({
      name: 'John Updated',
      phone: '9876543210',
      avatar: 'johnupdated.jpg',
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'Contact updated successfully');
  });

  // Test DELETE /contacts/:id - Delete a contact by ID
  it('should delete a contact by ID', async function () {
    const res = await api.delete(`/contacts/${createdContactId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Contact and avatar deleted successfully');
  });

  // Test PUT /contacts/:id/avatar - Update a contact's avatar
  it('should update the avatar for a contact', async function () {
    const res = await api.put(`/contacts/${createdContactId}/avatar`)
      .attach('avatar', './path-to-avatar-file.jpg'); // Replace with actual file path

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Avatar updated successfully!');
    expect(res.body).to.have.property('avatar');
  });
});
