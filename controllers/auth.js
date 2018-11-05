const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const errorHandler = require('../utils/error.handler');


module.exports.login = async function (req, res) {
  const candidate = await User.findOne({email: req.body.email});

  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, config.jwt, {expiresIn: 3600});

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Password do not match.'
      })
    }
  } else {
    res.status(404).json({
      message: 'Email not found.'
    })
  }
};

module.exports.register = async function (req, res) {
  const emailVerify = await User.findOne({email: req.body.email});

  if (emailVerify) {
    res.status(409).json({
      message: 'Email already exists, try again.'
    })
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json(user)
    } catch (e) {
      errorHandler(res, e)
    }
  }
};
