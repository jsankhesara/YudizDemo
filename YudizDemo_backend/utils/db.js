'use strict';

// Bring Mongoose into the app
const mongoose = require('mongoose');
const config = require('../utils/config');

// Create the database connection
mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('useCreateIndex', true);

// CONNECTION EVENTS

// When successfully connected
mongoose.connection.on('connected', () => {
    console.info(`Mongoose default connection open to ${config.DB_URI}`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.info('Mongoose default connection disconnected');
});

var options = {
    max: 50,
    maxAge: 1000 * 60 * 5,
    modelValues: true
};
var monc = require('monc');
monc.install(mongoose, options);


// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.debug('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
