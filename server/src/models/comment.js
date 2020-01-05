const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    text: {
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

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { as: 'author' });
    Comment.belongsTo(models.Probe);
  };

  return Comment;
};

export default comment;
