'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    post_text: DataTypes.STRING,
    post_image: DataTypes.STRING
  }, {});
  
  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Post.hasMany(models.Comments, {
      foreignKey: 'post_id',
      as: 'post_comment'
    });
    Post.hasMany(models.Likes, {
      foreignKey: 'post_id',
      as: 'post_likes'
    });
  };
  
  return Post;
};