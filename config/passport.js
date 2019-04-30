const passport = require('passport');
const jwtConfig = require('./jwtConfig');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Jwt Strategy Setup
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
}

// Create the Jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, next) => {

  console.log('payload received', jwt_payload.id);

  return next(null, db.User)
    .find({
      where: {
        id: jwt_payload.id
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return res.status(200).send(user);
    })
    .catch((error) => res.status(400).send(error));

})

passport.use(jwtLogin)