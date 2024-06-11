const express = require('express');
const router = express.Router();
const School = require('./models/school'); 



router.get('/', async (req, res) => {
    try {
        // Fetch schools from the database, sorted by name
        let schools = await School.find({}).sort({ name: 1 });

        // Map the results to the desired format
        schools = schools.map((school) => {
            return {
                self: '/api/v1/schools/' + school._id,
                id: school._id,
                name: school.name,
                linesId: school.linesId,
                position: school.position
            };
        });

        // Send the sorted results as the response
        res.status(200).json(schools);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
});



router.get('/:id', async (req, res) => {
    let school;
    try{
        school = await School.findById(req.params.id);
        if (!school) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/schools/' + school.id,
            id: school.id,
            name: school.name,
            linesId: school.linesId,
            position: school.position
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
    
});


router.post('', async (req, res) => {

	let school = new School({
        name: req.body.name,
        linesId: req.body.linesId,
        position: req.body.position
    });
    
	school = await school.save();
    let schoolId = school.id;
    console.log('School saved successfully');

    res.location("/api/v1/schools/" + schoolId).status(201).json(school).send();
});


router.put('/:id', async (req, res) => {
    let school;
    try {
        const { id } = req.params;
        school = await School.findByIdAndUpdate(id, req.body);

        if(!school) {
            return res.status(404).send("School not found");
        }
        const update = await School.findById(id);
        res.status(200).json(update);

    } catch (err) {
        console.log("API:", req.body);
        res.status(500).send("500 Internal Server Error");
    }
});


router.delete('/:id', async (req, res) => {
    let school = await School.findById(req.params.id).exec();
    if (!school) {
        res.status(404).send('school not found');
        console.log('school not found');
        return;
    }
    await school.deleteOne();
    console.log('school removed');
    res.status(204).send();
});

module.exports = router;


