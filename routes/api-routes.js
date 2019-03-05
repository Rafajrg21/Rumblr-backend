
let db = require("../models");
let passport = require("../config/passport");

module.exports = function(app) {
  
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json("/timeline");
  });

  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
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
  
};
