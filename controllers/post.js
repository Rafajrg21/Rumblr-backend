
let db = require("../models");

module.exports = {
  list(req, res) {
    return db.Post
      .findAll({ include:
        [{ model: db.User }]
      })
      .then((posts) => res.status(200).send(posts))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return db.Post
      .find({
        where: {
          id: req.params.id
         } 
        })
      .then((post) => {
        if (!post) {
          return res.status(404).send({
            message: 'Post Not Found',
          });
        }
        return res.status(200).send(post);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    //console.log(req.session)
    let newPost = {
      post_text: req.body.post_text,
      post_image: req.body.post_image,
      user_id: req.body.user_id
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
};