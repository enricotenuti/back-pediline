const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let invalidatedTokens = []; // Lista dei token invalidati

// Middleware per verificare il token
const tokenChecker = function(req, res, next) {
    var token = req.cookies.jwt;

    if (!token) {
        return res.status(201).json({ 
            success: true,
            message: 'No token provided.'
        });
    }

    // Controlla se il token è stato invalidato
    if (invalidatedTokens.includes(token)) {
        return res.status(403).json({
            success: false,
            message: 'Token has been invalidated.'
        });
    }

    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Failed to authenticate token.'
            });		
        } else {
            req.loggedUser = decoded;
            next();
        }
    });
};

// Route per verificare il token
router.get('', tokenChecker, (req, res) => {
    res.status(200).json({
        success: true,
        loggedUser: req.loggedUser,
		token: req.cookies.jwt
    });
});

// Route per il logout
router.post('/logout', (req, res) => {
    var token = req.cookies.jwt;

    if (token) {
        // Aggiungi il token alla lista degli invalidati
        invalidatedTokens.push(token);

        // Rimuovi il cookie dal client
        res.cookie('jwt', '', { maxAge: 0 });

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
