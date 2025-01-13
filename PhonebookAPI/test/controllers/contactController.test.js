import { expect } from 'chai';
import sinon from 'sinon';
import db from '../../models/index.js';
import * as contactController from '../../controllers/contactController.js'; // Import as a namespace
import deleteAvatar from '../../helpers/deleteAvatar.js';

const { Contact } = db;

describe('Contact Controller', function () {
  let sandbox;
  let mockResponse;

  beforeEach(function () {
    sandbox = sinon.createSandbox();  // Set up sandbox for mocking
    mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  afterEach(function () {
    sandbox.restore();  // Clean up after each test
  });

  // Test createContact function
  it('should create a new contact', async function () {
    const mockRequest = {
      body: {
        name: 'John Doe',
        phone: '1234567890',
        avatar: null
      }
    };

    // Mock Contact.create function
    const createContactStub = sandbox.stub(Contact, 'create').resolves({
      id: 1,
      name: 'John Doe',
      phone: '1234567890',
      avatar: null
    });

    await contactController.createContact(mockRequest, mockResponse);

    // Assertions
    expect(createContactStub.calledOnce).to.be.true;
    expect(mockResponse.status.calledWith(201)).to.be.true;
    expect(mockResponse.json.calledWith({
      id: 1,
      name: 'John Doe',
      phone: '1234567890',
      avatar: null
    })).to.be.true;
  });

  // Test createContact Fail
  it('should return 500 when failed to create contact', async function () {
    const mockRequest = {
      body: { 
        name: 'John Updated', 
        phone: '9876543210', 
        avatar: null }
    };

    // Mock Contact.update to throw an error (simulate server error)
    const createContactStub = sandbox.stub(Contact, 'create').throws(new Error('Database error'));

    await contactController.createContact(mockRequest, mockResponse);

    // Assertions
    expect(createContactStub.calledOnce).to.be.true;  // Check if the update function was called once
    expect(mockResponse.status.calledWith(500)).to.be.true;  // Check if status code 500 was sent for server error
    expect(mockResponse.json.calledWith({ error: 'Failed to create contact' })).to.be.true;  // Check the correct error message
  });

  // Test updateContact function
  it('should update a contact by ID', async function () {
    const mockRequest = {
      params: { id: 1 },
      body: { name: 'John Updated', phone: '9876543210', avatar: 'johnupdated.jpg' }
    };

    // Mock Contact.update function
    const updateContactStub = sandbox.stub(Contact, 'update').resolves([1]); // [1] means one row was updated

    await contactController.updateContact(mockRequest, mockResponse);

    // Assertions
    expect(updateContactStub.calledOnce).to.be.true;
    expect(mockResponse.status.calledWith(200)).to.be.true;  // 200 status for update
    expect(mockResponse.json.calledWith({ message: 'Contact updated successfully' })).to.be.true;
  });

  // Test updateContact NotFound
  it('should return 404 when contact is not found', async function () {
    const mockRequest = {
      params: { id: 1 },
      body: { name: 'John Updated', phone: '9876543210', avatar: 'johnupdated.jpg' }
    };

    // Mock Contact.update to simulate a "no rows updated" scenario (e.g., contact not found)
    const updateContactStub = sandbox.stub(Contact, 'update').resolves([0]);  // [0] means no rows updated

    await contactController.updateContact(mockRequest, mockResponse);

    // Assertions
    expect(updateContactStub.calledOnce).to.be.true;  // Check if the update function was called once
    expect(mockResponse.status.calledWith(404)).to.be.true;  // Check if status code 404 was sent for "not found"
    expect(mockResponse.json.calledWith({ error: 'Contact not found' })).to.be.true;  // Check the correct response message
  });

  // Test updateContact Error
  it('should return 500 when there is a server error', async function () {
    const mockRequest = {
      params: { id: 1 },
      body: { name: 'John Updated', phone: '9876543210', avatar: 'johnupdated.jpg' }
    };

    // Mock Contact.update to throw an error (simulate server error)
    const updateContactStub = sandbox.stub(Contact, 'update').throws(new Error('Database error'));

    await contactController.updateContact(mockRequest, mockResponse);

    // Assertions
    expect(updateContactStub.calledOnce).to.be.true;  // Check if the update function was called once
    expect(mockResponse.status.calledWith(500)).to.be.true;  // Check if status code 500 was sent for server error
    expect(mockResponse.json.calledWith({ error: 'Failed to update contact' })).to.be.true;  // Check the correct error message
  });

  // // Test deleteContact function
  // it('should delete a contact by ID', async function () {
  //   const mockRequest = {
  //     params: { id: 1 }
  //   };

  //   // Mock the necessary database functions
  //   const findByPkStub = sandbox.stub(Contact, 'findByPk').resolves({ id: 1, avatar: 'johndoe.jpg' });
  //   const destroyStub = sandbox.stub(Contact, 'destroy').resolves(1); // Simulate successful delete

  //   // Mock the deleteAvatar helper
  //   const deleteAvatarStub = sandbox.stub(deleteAvatar).resolves()

  //   await contactController.deleteContact(3001)(mockRequest, mockResponse);

  //   // Assertions
  //   expect(findByPkStub.calledOnce).to.be.true;
  //   expect(destroyStub.calledOnce).to.be.true;
  //   expect(deleteAvatarStub.calledOnceWith(3001, 'http://localhost:3001/uploads/johndoe.jpg')).to.be.true;
  //   expect(mockResponse.status.calledWith(200)).to.be.true;
  //   expect(
  //     mockResponse.json.calledWith({
  //       message: 'Contact and avatar deleted successfully',
  //     })
  //   ).to.be.true;
  // });


  // Test deleteContact function when contact not found
  it('should return 404 if contact is not found in deleteContact', async function () {
    const mockRequest = {
      params: { id: 999 } // Invalid ID
    };

    // Mock the Contact.findByPk to return null (contact not found)
    const findByPkStub = sandbox.stub(Contact, 'findByPk').resolves(null);

    await contactController.deleteContact(3001)(mockRequest, mockResponse);

    // Assertions
    expect(findByPkStub.calledOnce).to.be.true;
    expect(mockResponse.status.calledWith(404)).to.be.true;
    expect(mockResponse.json.calledWith({ error: 'Contact not found' })).to.be.true;
  });

  // Test deleteContact function when Error deleting contact
  // it('should return 500 if contact is error to delete', async function () {
  //   const mockRequest = {
  //     params: { id: 999 } // Invalid ID
  //   };

  //   // Mock the Contact.findByPk to return null (contact not found)
  //   const findByPkStub = sandbox.stub(Contact, 'findByPk').resolves({
  //     id: 999, 
  //     avatar: 'path/to/avatar.jpg'
  //   });

  //   const deleteAvatarStub = sandbox.stub(deleteAvatar, 'default').rejects(new Error('Failed to delete avatar'));

  //   await contactController.deleteContact(3001)(mockRequest, mockResponse);

  //   // Assertions
  //   expect(findByPkStub.calledOnce).to.be.true;
  //   expect(deleteAvatarStub.calledOnce).to.be.true;
  //   expect(mockResponse.status.calledWith(500)).to.be.true;
  //   expect(mockResponse.json.calledWith({ error: 'Failed to delete contact' })).to.be.true;
  // });
});
