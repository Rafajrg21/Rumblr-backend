// Npm packages necessary for server to work
let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
//requiring passport, after express
let passport = require("./config/passport");

let PORT = process.env.PORT || 3000;
// Importing the db models folder
let db = require('./models');

// Creating express app and configuring middleware
let app = express();
app.use(bodyParser.urlencoded({ extended: false })); //! check if still needed for body parser
app.use(bodyParser.json());
app.use(express.static("public"));

//session and passport initialization
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() =>{
    app.listen(PORT, () => {
      console.log(`🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
    });
  });
