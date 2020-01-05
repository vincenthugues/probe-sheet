const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    isValidated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  });

  User.associate = (models) => {
    User.hasMany(models.Sheet, { foreignKey: 'ownerId' });
  };

  User.findByLogin = async (login) => {
    let fetchedUser = await User.findOne({
      where: { username: login },
    });

    if (!fetchedUser) {
      fetchedUser = await User.findOne({
        where: { email: login },
      });
    }

    return fetchedUser;
  };

  return User;
};

export default user;
