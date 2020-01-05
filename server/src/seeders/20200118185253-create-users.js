module.exports = {
  up: queryInterface => queryInterface.bulkInsert('users', [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
      role: 'admin',
      isValidated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Jane Doe',
      email: 'jane@example.com',
      password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
      role: 'user',
      isValidated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'John Doe',
      email: 'john@example.com',
      password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
      role: 'user',
      isValidated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'Jim',
      email: 'jim@example.com',
      password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
      role: 'user',
      isValidated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
