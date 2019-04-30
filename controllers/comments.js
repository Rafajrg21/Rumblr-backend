
let db = require("../models");

module.exports = {
  list(req, res) {
    return db.Comments
      .findAll({
        where: {
          user_id: req.body.user_id
        } 
        },{ include:[
          { model: db.User }
        ]
      })
      .then((comments) => res.status(200).send(comments))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return db.Comments
      .findAll({
        where: {
          post_id: req.params.post_id
         } 
        },{
          include: [{ model: db.Post }]
      })
      .then((comments) => {
        if (!comments) {
          return res.status(404).send({
            message: 'There are no comments in this post',
          });
        }
        return res.status(200).send(comments);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    //console.log(req.session)
    let newComment = {
      comment_text: req.body.comment_text,
      comment_url: req.body.comment_url,
      user_id: req.body.user_id,
      post_id: req.params.post_id
    };
    return db.Comments
      .create(newComment,{
        include: [{ model: db.User },{ model: db.Post }]
      })
      .then((comment) => {
        res.status(201).send(comment)
      })
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return db.Comments
      .findById(req.params.id, {
        include: [
            { model: db.User },
            { model: db.Post }
        ],
      })
      .then(comment => {
        if (!comment) {
          return res.status(404).send({
            message: 'Comment Not Found',
          });
        }
        return comment
          .update({
            comment_text: req.body.comment_text,
            comment_url: req.body.comment_url
          })
          .then(() => res.status(200).send(comment))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return db.Comments
      .findById(req.params.id)
      .then(comment => {
        if (!comment) {
          return res.status(400).send({
            message: 'Comment Not Found',
          });
        }
        return comment
          .destroy()
          .then(() =>{
            console.log(`Se elimino el comentario ${req.params.id}`)
            res.status(204).send()
          }) 
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};