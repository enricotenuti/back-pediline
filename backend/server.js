const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());

const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });

const users = require('./users.js');
const lines = require('./lines.js');
const stops = require('./stops.js');
const lists = require('./lists.js');
const schools = require('./schools.js');
const calendars = require('./calendars.js');
const alerts = require('./alerts.js');
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Swagger */
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pediline',
            version: '1.0.0',
        },
    },
    apis: ['./oas3.yaml'], // files containing annotations as above
};
const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // ? write in browser localhost:3000/api-docs

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

app.use('/api/v1/stops', stops);
app.use('/api/v1/lines', lines);
app.use('/api/v1/lists', lists);
app.use('/api/v1/schools', schools);
app.use('/api/v1/calendars', calendars);
app.use('/api/v1/users', users);
app.use('/api/v1/token', tokenChecker);
app.use('/api/v1/authenticate', authentication);
app.use('/api/v1/alerts', alerts);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // Use path.join to get the absolute path
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
