'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const contacts = [];
    for (let i = 1; i <= 100; i++) {
      contacts.push({
        name: `Contact ${i}`,
        phone: `0819-1369-${String(i).padStart(4, '0')}`, 
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert the generated contacts into the Contacts table
    await queryInterface.bulkInsert('Contacts', contacts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contacts', null, {});
  }
};
