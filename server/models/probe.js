const probe = (sequelize, DataTypes) => {
    const Probe = sequelize.define('probe', {
        type: DataTypes.STRING,
        date: DataTypes.DATE,
        response: DataTypes.BOOLEAN,
    });
  
    Probe.associate = models => {
        Probe.belongsTo(models.User, { as: 'therapist' });
        Probe.belongsTo(models.Target);
        Probe.hasOne(models.Comment);
    };

    return Probe;
};

export default probe;
