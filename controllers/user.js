const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let db = require('../models');
const config = require('../config/jwtConfig');

module.exports = {

  register(req,res){
    const rounds = 12;
    const hashed = bcrypt.hashSync(req.body.password, rounds);
    
    const data = {
      email: req.body.email,
      username: req.body.username,
      password: hashed,
      bio: req.body.bio,
      avatar: req.body.avatar
    };

    if(data.password == '' || data.username == ''){
      res.status(428).send({
        status: 428,
        message: 'Username and password required!'
      })
    }
      db.User.findOne({
        where: {
          username: data.username
        }
      })
      .then(user => {
        if(user != null) {
          console.log('username already taken');
          res.status(409).send({
            status: 409,
            message: 'username already taken'            
          });
        }
      })

      db.User.findOne({
        where: {
          email: data.email
        }
      })
      .then(user => {
        if(user != null) {
          console.log('this email already has an account');
          res.status(409).send({
            status: 409,
            message: 'this email already has an account'            
          });
        } else {

          db.User.create({
            email: data.email,
            username: data.username,
            password: data.password,
            bio: data.bio,
            avatar: data.avatar
          })
          .then((user) => {
            const  expiresIn  =  24 * 60 * 60;
            const  accessToken  =  jwt.sign({ id:  user.id }, config.secret, {
                expiresIn:  expiresIn
            });
            console.log('user created');
            res.status(201).send({
              status: 201,
              message: 'user created',
              accessToken: accessToken,
              expiresIn: expiresIn
            });
          })
          .catch(err => {
            console.log('Problem with the create');
            res.status(500).send({
              status: 500,
              message: `email taken: ${err}`        
            });
          })
        }
      })
      .catch(err => {
        console.log('Problem with the db');
        res.status(500).send({
          status: 500,
          message: `Error with db: ${err}`        
        });
      })
    },

    login(req, res){
      const data = {
        username: req.body.username,
        password: req.body.password
      }

      if(data.password == '' || data.username == ''){
        res.status(428).send({
          status: 428,
          message: 'Username and password required!'
        })
      }
        db.User.findOne({
          where: {
            username: data.username
          }
        })
        .then(user => {
          if(!user) {
            console.log('user not found');
            res.status(409).send({
              status: 409,
              message: 'user not found'            
            });
          } else {
            const result = bcrypt.compareSync(data.password, user.password)
            if(!result) {
              console.log('Password not valid!');
              res.status(401).send({
                status: 401,
                message: `Password not valid!`        
              });    
            } 
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({ id:  user.id }, config.secret, {
            expiresIn:  expiresIn
            });
            res.status(200).send({
              status: 200,
              user: user,
              accessToken: accessToken,
              expiresIn: expiresIn
            });
          }
        }) 
        .catch(err => {
          console.log('Problem with the db');
          res.status(500).send({
            status: 500,
            message: `Error with db: ${err}`        
          });
        })
    },
  
    getById(req, res) {
      return db.User
        .findOne({
          where: {
            id: req.params.id
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
    },
    
    update(req, res) {
      return db.User
        .findById(req.params.id)
        .then(user => {
          if (!user) {
            return res.status(404).send({
              message: 'User Not Found',
            });
          }
          return user
            .update({
              bio: req.body.bio
            })
            .then(() => res.status(200).send(user))
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    },
    
  };