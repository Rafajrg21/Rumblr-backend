// Requiring path to so we can use relative routes to our HTML files
let path = require("path");

let isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    if (req.user) {
      res.redirect("/timeline");
    }
    //res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    if (req.user) {
      res.redirect("/timeline");
    }
    //res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/timeline", isAuthenticated, function(req, res) {
    //res.sendFile(path.join(__dirname, "../public/members.html"));
  });
};
