const app = require('./backend/server.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const port = 3000;



app.locals.db = mongoose.connect(process.env.DB_URL)
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});