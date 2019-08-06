const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    text: DataTypes.STRING,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { as: 'author' });
    Comment.belongsTo(models.Probe);
  };

  return Comment;
};

export default comment;
