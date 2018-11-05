const express = require('express');
const passport = require('passport');
const controller = require('../controllers/analytic');
const router = express.Router();


router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview);
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytic);


module.exports = router;
