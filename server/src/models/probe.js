const probe = (sequelize, DataTypes) => {
  const Probe = sequelize.define('probe', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    response: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    therapist: {
      type: DataTypes.STRING,
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

  Probe.associate = (models) => {
    Probe.belongsTo(models.User, { as: 'owner' });
    Probe.belongsTo(models.Target);
  };

  return Probe;
};

export default probe;
