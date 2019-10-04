const accessRight = (sequelize, DataTypes) => {
  const AccessRight = sequelize.define('access_right', {
    role: {
      type: DataTypes.ENUM('viewer', 'contributor'),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
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
    AccessRight.belongsTo(models.Sheet);
  };

  return AccessRight;
};

export default accessRight;
