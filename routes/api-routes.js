
let db = require("../models");
let passport = require("../config/passport");

// Importing all controllers 
const postController = require('../controllers/post');
const likesController = require('../controllers/likes');
const commentController = require('../controllers/comments');

// Importing passport middleware
let isAuth = require('../config/middleware/isAuthenticated'); 

module.exports = function(app) {
  
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.redirect("/api/timeline");
  });

  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
      avatar: req.body.avatar
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  });

  app.get("/api/logout", function(req, res) {
    req.logout();
    res.redirect("/api/login");
  });

  app.get("/api/profile", function(req, res) {
    if (!req.user) {
      res.json({});
    }
    else {
      res.json({
        email: req.user.email,
        username: req.user.username
      });
    }
  });
  
  // Post routes
  app.get('/api/timeline', postController.list);
  app.get('/api/post/:id', postController.getById);
  app.post('/api/post', postController.add);
  app.delete('/api/post/:id', postController.delete);
  // Likes routes 
  app.get('/api/profile/likes', likesController.list);
  app.get('/api/post/:post_id/likes', likesController.getById);
  app.post('/api/post/:post_id/like', likesController.add);
  app.put('/api/post/:post_id/like/:id', likesController.update)
  // Comments routes
  app.get('/api/profile/comments', commentController.list);
  app.get('/api/post/:post_id/comments', commentController.getById);
  app.post('/api/post/:post_id/comment', commentController.add);
  app.put('/api/post/:post_id/comment/:id', commentController.update);
  app.delete('/api/post/:post_id/comment/:id', commentController.delete);
};
