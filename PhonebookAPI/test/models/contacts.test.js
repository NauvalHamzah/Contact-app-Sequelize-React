// test/models/contact.test.js
import { expect } from 'chai';
import db from '../../models/index.js';

describe('Contact Model', function () {
  before(async function () {
    await db.sequelize.sync({ force: true }); // Reset the DB before tests
  });

  it('should create a new contact', async function () {
    const contact = await db.Contact.create({
      name: 'John Doe',
      phone: '1234567890',
      avatar: 'johndoe.jpg'
    });

    expect(contact).to.have.property('name', 'John Doe');
    expect(contact).to.have.property('phone', '1234567890');
    expect(contact).to.have.property('avatar', 'johndoe.jpg');
  });

  it('should not create a contact with missing required fields', async function () {
    try {
      await db.Contact.create({
        name: 'Jane Doe',
        // Missing 'phone' and 'avatar'
      });
    } catch (error) {
      expect(error).to.have.property('name', 'SequelizeValidationError');
    }
  });
});
