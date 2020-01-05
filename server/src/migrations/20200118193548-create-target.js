module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('targets', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    baselineProbesNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    dailyProbesStreak: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    sheetId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'sheets',
        },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }),
  down: queryInterface => queryInterface.dropTable('targets'),
};
