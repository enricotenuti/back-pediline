const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const school = require('./models/school');



// router.get('/me', async (req, res) => {
//     if(!req.loggedUser) {
//         return;
//     }

//     // https://mongoosejs.com/docs/api.html#model_Model.find
//     let user = await User.findOne({email: req.loggedUser.email});

//     res.status(200).json({
//         self: '/api/v1/users/' + user.id,
//         email: user.email
//     });
// });

router.get('', async (req, res) => {
    let users;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        users = await User.find({email: req.query.email}).exec();
    else
        users = await User.find().exec();

    users = users.map( (entry) => {
        return {
            self: '/api/v1/users/' + entry.id,
            id: entry.id,
            email: entry.email,
            role: entry.role,
            school: entry.school,
            line: entry.line,
            stop: entry.stop
        }
    });

    res.status(200).json(users);
});



router.get('/exist', async (req, res) => {
    try {
        if (req.query.email) {
            // Cerca un singolo utente con l'email fornita
            const existingUser = await User.findOne({ email: req.query.email }).exec();
            if (existingUser) {
                return res.status(200).json({ exists: true });
            } else {
                return res.status(200).json({ exists: false });
            }
        } else {
            return res.status(400).json({ error: 'The field "email" must be provided' });
        }
    } catch (error) {
        console.error('Error while fetching users:', error);
        return res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});



router.get('/:id', async (req, res) => {
    let user;
    try {
        user = await User.findById(req.params.id);    
        if (!user) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/users/' + user.id,
            id: user.id,
            email: user.email,
            role: user.role,
            school: user.school,
            line: user.line,
            stop: user.stop
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
});

router.put('/:id', async (req, res) => { //modifica oggetto specifico
    let user;
    try {
        const { id } = req.params;
        user = await User.findByIdAndUpdate(id, req.body);

        if(!user) {
            return res.status(404).send("User not found");
        }
        const update = await User.findById(id);
        res.status(200).json(update);

    } catch (err) {
        res.status(500).send("500 Internal Server Error");
    }
});


router.post('', async (req, res) => {
    try {
        let user = new User({
            email: req.body.email,
            password: req.body.password, // Salva la password in chiaro (NON SICURO)
            role: req.body.role,
            // if school exists, give it req.body.school, otherwise give it null
            school: req.body.school,
            // if line exists, give it req.body.line, otherwise give it null
            line: req.body.line,
            // if stop exists, give it req.body.stop, otherwise give it null
            stop: req.body.stop 
        });

        if (!user.email || typeof user.email != 'string' || !checkIfEmailInString(user.email)) {
            return res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        }
        
        user = await user.save();
        
        let userId = user.id;

        /**
         * Link to the newly created resource is returned in the Location header
         * https://www.restapitutorial.com/lessons/httpmethods.html
         */
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: userId,
                email: user.email,
                role: user.role,
                school: user.school,
                line: user.line,
                stop: user.stop
            }
        });
    } catch (error) {
        console.error('Error while registering user:', error);
        return res.status(500).json({ error: 'An error occurred while registering the user' });
    }
});





router.delete('/:id', async (req, res) => {
    let user = await User.findById(req.params.id).exec();
    if (!user) {
        res.status(404).send('User not found');
        return;
    }
    await user.deleteOne();
    res.status(204).send();
});


// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}



module.exports = router;