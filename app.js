const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const analyticRoutes = require('./routes/analytic');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const config = require('./config/config');

const app = express();

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
}).then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'));
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })
}

module.exports = app;