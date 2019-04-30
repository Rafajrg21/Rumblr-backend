const passport = require('passport');
require('../config/passport')

// Importing all controllers 
const postController = require('../controllers/post');
const likesController = require('../controllers/likes');
const commentController = require('../controllers/comments');
const userController = require('../controllers/user');

// JwtMiddleware
const requireToken = passport.authenticate('jwt', {session:false});

module.exports = (app) => {

// Authentication routes
app.post("/api/signup", userController.register);
app.post("/api/login", userController.login);
app.get("/api/logout", function(req, res) {
  req.logout();
  res.redirect("login");
});

// User related routes
app.get('/api/profile/:id', requireToken, userController.getById);
app.put('/api/profile/:id', requireToken, userController.update);

// Post routes
app.get('/api/posts', requireToken, postController.list);
app.get('/api/posts/:id', requireToken, postController.getById);
app.post('/api/posts', requireToken, postController.add);
app.delete('/api/posts/:id', requireToken, postController.delete);

// Likes routes 
//router.get('/api/profile/likes', likesController.list);
app.get('/api/posts/:post_id/likes', requireToken, likesController.getById);
app.post('/api/posts/:post_id/likes', requireToken, likesController.add);
app.put('/api/posts/:post_id/likes/:id', requireToken, likesController.update)

// Comments routes
//router.get('/api/profile/comments', commentController.list);
app.get('/api/posts/:post_id/comments', requireToken, commentController.getById);
app.post('/api/posts/:post_id/comments', requireToken, commentController.add);
app.put('/api/posts/:post_id/comments/:id', requireToken, commentController.update);
app.delete('/api/posts/:post_id/comments/:id', requireToken, commentController.delete);
  
}