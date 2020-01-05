const target = (sequelize, DataTypes) => {
  const Target = sequelize.define('target', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    baselineProbesNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dailyProbesStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  Target.associate = (models) => {
    Target.belongsTo(models.User, { as: 'owner' });
    Target.belongsTo(models.Sheet);
    Target.hasMany(models.Probe);
  };

  return Target;
};

export default target;
