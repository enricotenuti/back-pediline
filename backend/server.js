const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Middleware per CORS e cookie parsing
app.use(cors({
    origin: 'https://front-pediline.onrender.com',
    credentials: true
}));
app.use(cookieParser());

// Caricamento delle variabili d'ambiente
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });

// Importazione delle route
const users = require('./users.js');
const lines = require('./lines.js');
const stops = require('./stops.js');
const lists = require('./lists.js');
const schools = require('./schools.js');
const calendars = require('./calendars.js');
const alerts = require('./alerts.js');
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

// Middleware per il parsing delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurazione di Swagger per la documentazione delle API
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
    apis: ['./oas3.yaml'],
};
const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware di logging delle richieste
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url);
    next();
});

// Route delle API
app.use('/api/v1/stops', stops);
app.use('/api/v1/lines', lines);
app.use('/api/v1/lists', lists);
app.use('/api/v1/schools', schools);
app.use('/api/v1/calendars', calendars);
app.use('/api/v1/users', users);
app.use('/api/v1/token', tokenChecker);
app.use('/api/v1/authenticate', authentication);
app.use('/api/v1/alerts', alerts);

// Middleware di gestione degli errori 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;
