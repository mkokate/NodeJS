const express = require('express');
const app = express();
const db = require('./db');

const authHandler = require('./auth/AuthHandler');
app.use('/api/auth', authHandler);

const userManager = require('./user/UserManager');
app.use('/users', userManager);

module.exports = app;