const sheet = (sequelize, DataTypes) => {
    const Sheet = sequelize.define('sheet', {
        student: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        skillDomain: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
  
    Sheet.associate = models => {
        Sheet.belongsTo(models.User, { as: 'owner' });
        Sheet.hasMany(models.Target);
    };
  
    return Sheet;
};

export default sheet;
