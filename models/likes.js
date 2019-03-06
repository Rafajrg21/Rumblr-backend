'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    like_status: DataTypes.INTEGER
  }, {});
  
  Likes.associate = function(models) {
    Likes.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
    Likes.belongsTo(models.Post, {
      foreignKey: 'post_id'
    });
  };
  
  return Likes;
};