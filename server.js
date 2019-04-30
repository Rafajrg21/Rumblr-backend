// Npm packages necessary for server to work
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const PORT = process.env.PORT || 3000;

// Importing our models 
let db = require('./models');

// Creating express app and configuring middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.static(__dirname + '/public'));

// Enable cors for all routes
app.use(cors());

// Require our routes
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() =>{
    app.listen(PORT, () => {
      console.log(`🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
    });
  });
