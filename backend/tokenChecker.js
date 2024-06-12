const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let invalidatedTokens = []; // Lista dei token invalidati

// Middleware per verificare il token
const tokenChecker = function(req, res, next) {
    var token = req.headers['authorization'];
    console.log('Token ricevuto:', token);

    if (!token) {
        return res.status(201).json({ 
            success: true,
            message: 'No token provided.'
        });
    }

    // Rimuove il prefisso "Bearer " dal token
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    } else {
        return res.status(403).json({
            success: false,
            message: 'Invalid token format.'
        });
    }

    // Controlla se il token è stato invalidato
    if (invalidatedTokens.includes(token)) {
        console.log('Token invalidato:', token);
        return res.status(403).json({
            success: false,
            message: 'Token has been invalidated.'
        });
    }

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) {
            console.log('Errore nella verifica del token:', err);
            return res.status(403).json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        } else {
            req.loggedUser = decoded;
            console.log('Token verificato con successo:', decoded);
            next();
        }
    });
};

// Route per verificare il token
router.get('', tokenChecker, (req, res) => {
    res.status(200).json({
        success: true,
        loggedUser: req.loggedUser,
        token: req.headers['authorization']
    });
});

// Route per il logout
router.post('/logout', (req, res) => {
    var token = req.headers['authorization'];

    if (token) {
        // Rimuove il prefisso "Bearer " dal token
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        
        // Aggiungi il token alla lista degli invalidati
        invalidatedTokens.push(token);
        console.log('Token invalidato e aggiunto alla lista:', token);

        res.status(200).json({ 
            success: true,
            message: 'Successfully logged out.'
        });
    } else {
        res.status(400).json({ 
            success: false,
            message: 'No token to invalidate.'
        });
    }
});

module.exports = router;
