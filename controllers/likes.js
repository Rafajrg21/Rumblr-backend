
let db = require("../models");

module.exports = {
  list(req, res) {
    return db.Likes
      .findAll({
        where: {
          user_id: req.session.passport.user.id
         } 
        },{ 
        include:[
            { model: db.User }
        ]
      })
      .then((likes) => res.status(200).send(likes))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return db.Likes
      .findAll({
        where: {
          post_id: req.params.post_id
         } 
        },{
            include: [{ model: db.Post }]
        })
      .then((likes) => {
        if (!likes) {
          return res.status(404).send({
            message: 'Not existing like',
          });
        }
        return res.status(200).send(likes);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    //console.log(req.session)
    let newLike = {
      like_status: req.body.like_status,
      user_id: req.session.passport.user.id,
      post_id: req.params.post_id
    };
    return db.Likes
      .create(newLike,{
        include: [{ model: db.User },{ model: db.Post }]
      })
      .then((like) => {
        res.status(201).send(like)
      })
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return db.Likes
      .findById(req.params.id, {
        include: [ 
            { model: db.User },
            { model: db.Post } 
        ],
      })
      .then(like => {
        if (!like) {
          return res.status(404).send({
            message: 'Like Not Existing',
          });
        }
        return like
          .update({
            like_status: req.body.like_status
          })
          .then(() => res.status(200).send(like))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};