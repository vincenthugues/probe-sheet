const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
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
    });

    User.associate = models => {
        User.hasMany(models.Sheet);
    };

    User.findByLogin = async login => {
        let user = await User.findOne({
            where: { username: login },
        });
    
        if (!user) {
            user = await User.findOne({
                where: { email: login },
            });
        }
    
        return user;
    };

    return User;
};
  
export default user;
