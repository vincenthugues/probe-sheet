module.exports = {
  up: queryInterface => queryInterface.bulkInsert('comments', [
    {
      text: 'Test comment',
      authorId: 2,
      probeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      text: 'Comment 2',
      authorId: 2,
      probeId: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('comments', null, {}),
};
