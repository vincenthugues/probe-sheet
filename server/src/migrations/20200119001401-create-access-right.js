module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('access_rights', {
    role: {
      type: Sequelize.ENUM('viewer', 'contributor'),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('access_rights'),
};
