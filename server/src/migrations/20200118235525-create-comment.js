module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    authorId: {
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
    probeId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'probes',
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
  down: queryInterface => queryInterface.dropTable('comments'),
};
