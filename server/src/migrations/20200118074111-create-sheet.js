module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('sheets', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    student: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    skillDomain: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: queryInterface => queryInterface.dropTable('sheets'),
};
