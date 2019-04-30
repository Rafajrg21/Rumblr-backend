const passport = require('passport');
const jwtConfig = require('./jwtConfig');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
let db = require('../models');

// Jwt Strategy Setup
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
}

// Create the Jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, next) => {

  console.log('payload received', jwt_payload.id);

  db.User.findOne({
      where: {
        id: jwt_payload.id
      }
    })
    .then((user) => {
      if (!user) {
        console.log('There is no user or token not valid')
      }
      return next(null, user)
    })
    .catch((error) => console.log(error.stack));

})

passport.use(jwtLogin)