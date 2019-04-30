const passport = require('passport');

// Importing all controllers 
const postController = require('../controllers/post');
const likesController = require('../controllers/likes');
const commentController = require('../controllers/comments');
const userController = require('../controllers/user');

const requireToken = passport.authenticate('jwt', {session:false});

module.exports = function(app) {
  
  // Authentication routes
  app.post("/api/signup", userController.register);
  
  app.post("/api/login", function(req, res) {
    res.redirect("/api/posts");
  });

  app.get("/api/logout", function(req, res) {
    req.logout();
    res.redirect("/api/login");
  });

  // User related routes
  app.get('/api/profile/:id', userController.getById);
  app.put('/api/profile/:id', userController.update);
  
  // Post routes
  app.get('/api/posts', postController.list);
  app.get('/api/posts/:id', postController.getById);
  app.post('/api/posts', postController.add);
  app.delete('/api/posts/:id', postController.delete);
  // Likes routes 
  //app.get('/api/profile/likes', likesController.list);
  app.get('/api/posts/:post_id/likes', likesController.getById);
  app.post('/api/posts/:post_id/likes', likesController.add);
  app.put('/api/posts/:post_id/likes/:id', likesController.update)
  // Comments routes
  //app.get('/api/profile/comments', commentController.list);
  app.get('/api/posts/:post_id/comments', commentController.getById);
  app.post('/api/posts/:post_id/comments', commentController.add);
  app.put('/api/posts/:post_id/comments/:id', commentController.update);
  app.delete('/api/posts/:post_id/comments/:id', commentController.delete);
};
