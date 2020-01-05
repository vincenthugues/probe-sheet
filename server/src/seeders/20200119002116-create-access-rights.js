module.exports = {
  up: queryInterface => queryInterface.bulkInsert('access_rights', [
    {
      role: 'contributor',
      email: 'john@example.com',
      sheetId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role: 'viewer',
      email: 'john@example.com',
      sheetId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('access_rights', null, {}),
};
