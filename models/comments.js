'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    comment_text: DataTypes.STRING,
    comment_url: DataTypes.STRING
  }, {});
  
  Comments.associate = function(models) {
    Comments.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
    Comments.belongsTo(models.Post, {
      foreignKey: 'post_id'
    });
  };
  
  return Comments;
};