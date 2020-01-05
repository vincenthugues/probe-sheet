const accessRight = (sequelize, DataTypes) => {
  const AccessRight = sequelize.define('access_right', {
    role: {
      type: DataTypes.ENUM('viewer', 'contributor'),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['email', 'sheetId'],
      },
    ],
  });

  AccessRight.associate = (models) => {
    AccessRight.belongsTo(models.Sheet, {
      foreignKey: { primaryKey: true },
    });
  };

  return AccessRight;
};

export default accessRight;
