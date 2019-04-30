// Npm packages necessary for server to work
let express = require("express");
let bodyParser = require("body-parser");
var cors = require('cors')

let PORT = process.env.PORT || 3000;
// Importing the db models folder
let db = require('./models');

// Creating express app and configuring middleware
let app = express();
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(express.static("public"));

// Enable cors for all routes
app.use(cors())

// Requiring our routes
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() =>{
    app.listen(PORT, () => {
      console.log(`🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
    });
  });
