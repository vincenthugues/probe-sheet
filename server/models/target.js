const target = (sequelize, DataTypes) => {
    const Target = sequelize.define('target', {
        name: DataTypes.STRING,
        baselineProbesNumber: DataTypes.INTEGER,
        dailyProbesStreak: DataTypes.INTEGER,
    });
  
    Target.associate = models => {
        Target.belongsTo(models.User, { as: 'therapist' });
        Target.belongsTo(models.Sheet);
        Target.hasMany(models.Probe);
    };
   
    return Target;
};

export default target;
