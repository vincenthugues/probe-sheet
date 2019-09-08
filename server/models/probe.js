const probe = (sequelize, DataTypes) => {
  const Probe = sequelize.define('probe', {
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    response: DataTypes.BOOLEAN,
    therapist: DataTypes.STRING,
  });

  Probe.associate = (models) => {
    Probe.belongsTo(models.User, { as: 'owner' });
    Probe.belongsTo(models.Target);
  };

  return Probe;
};

export default probe;
