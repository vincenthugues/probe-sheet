module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('probes', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    response: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    therapist: {
      type: Sequelize.STRING,
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
    targetId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'targets',
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
  down: queryInterface => queryInterface.dropTable('probes'),
};
