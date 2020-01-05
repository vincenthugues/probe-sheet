module.exports = {
  up: queryInterface => queryInterface.bulkInsert('sheets', [
    {
      student: 'J.D.',
      skillDomain: 'Language réceptif',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      student: 'A.B.',
      skillDomain: 'Language réceptif',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      student: 'J.D.',
      skillDomain: 'Motricité fine',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('sheets', null, {}),
};
