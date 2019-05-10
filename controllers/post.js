
let db = require("../models");

module.exports = {
  list(req, res) {
    return db.Post
      .findAll({ include:
        [{ model: db.User }]
      },
      { order: 
        [ ['createdAt', 'DESC'] ]
      },
      )
      .then((posts) => res.status(200).send(posts))
      .catch((error) => { res.status(400).send(error); });
  },

  getByUsername(req, res) {
    return db.User 
    .findOne({
      where: {
        username: req.body.username 
       } 
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        return next.status(200).send(user);
      })
      .catch((error) => res.status(400).send(error));
  },

  getUserPost(req, res){
    return db.Post
    .findAll({
      where: {
        user_id: req.params.id 
       } 
      })
      .then((posts) => {
        if (!posts) {
          return res.status(404).send({
            message: 'posts Not Found',
          });
        }
        return res.status(200).send(posts);
      })
      .catch((error) => res.status(400).send(error));
  },

  getPost(req, res){
    return db.Post
    .findAll({
      where: {
        id: req.params.post_id 
       } 
      })
      .then((posts) => {
        if (!posts) {
          return res.status(404).send({
            message: 'posts Not Found',
          });
        }
        return res.status(200).send(posts);
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return db.Post
      .findById(req.params.id)
      .then(post => {
        if (!post) {
          return res.status(400).send({
            message: 'Post Not Found',
          });
        }
        return post
          .destroy()
          .then(() =>{
            console.log(`Se elimino el post ${req.params.id}`)
            res.status(204).send()
          }) 
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res){
    let newPost = {
      post_text: req.body.post_text,
      user_id: req.params.id
    };
    return db.Post
      .create(newPost,{
        include: [{ model: db.User }]
      })
      .then((post) => {
        res.status(201).send(post)
      })
      .catch((error) => res.status(400).send(error));
  },

};