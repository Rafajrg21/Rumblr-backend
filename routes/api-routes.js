const passport = require('passport');
require('../config/passport')
const multer = require('multer');
const fs = require('fs-extra');
let db = require("../models");

// Importing all controllers 
const postController = require('../controllers/post');
const likesController = require('../controllers/likes');
const commentController = require('../controllers/comments');
const userController = require('../controllers/user');

// JwtMiddleware
const requireToken = passport.authenticate('jwt', {session:false});

// Multer configuration
let storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    console.log(__dirname)
      let path = 'C:/Dev/moviles/ionic/Rumblr/src/assets'; 
      if(!fs.existsSync(path)){
          fs.mkdirSync(path);
          cb(null, path);
      }
      cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, `image-${Date.now()}.${filetype}`);
  }
});

let upload = multer({
  storage: storage
})

module.exports = (app) => {

// Authentication routes
app.post("/api/signup", userController.register);
app.post("/api/login", userController.login);

// User related routes
app.get('/api/profile/:id', requireToken, userController.getById);
app.get('/api/users/:username', userController.getByUsername);
app.put('/api/profile/:id', requireToken, userController.updateUser);
app.put('/api/profile/:username', requireToken, upload.single('avatar'),

(req, res) => {
  return db.User
  .findOne({
    where: {
      username: req.params.username
     } 
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return user
        .update({
          bio: req.body.bio,
          avatar: `${req.file.destination}/${req.file.filename}`
        })
        .then(() => res.status(200).send(user))
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
},);

// Post routes
app.get('/api/posts', postController.list);
app.get('/api/posts/:id', postController.getUserPost);
app.get('/api/post/:post_id', postController.getPost);
app.delete('/api/posts/:id', requireToken, postController.delete);
app.post('/api/posts', requireToken, upload.single('avatar'),

(req, res) => {

  let newPost = {
    post_text: req.body.post_text,
    post_image: `${req.file.destination}/${req.file.filename}`,
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
});
app.post('/api/post/:id', requireToken, postController.add);

// Likes routes 
//router.get('/api/profile/likes', likesController.list);
app.get('/api/posts/:post_id/likes', likesController.getById);
app.post('/api/posts/:post_id/likes', requireToken, likesController.add);
app.put('/api/posts/:post_id/likes/:id', requireToken, likesController.update);

// Comments routes
//router.get('/api/profile/comments', commentController.list);
app.get('/api/posts/:post_id/comments', commentController.list);
app.post('/api/posts/:post_id/comments', requireToken, commentController.add);
app.put('/api/posts/:post_id/comments/:id', requireToken, commentController.update);
app.delete('/api/posts/:post_id/comments/:id', requireToken, commentController.delete);
  
}