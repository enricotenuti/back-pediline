const express = require('express');
const router = express.Router();
const Line = require('./models/line'); 

router.get('/', async (req, res) => {
    let lines = await Line.find({});
    
    lines = lines.map( (line) => {
        return {
            self: '/api/v1/lines/' + line.id,
            id: line.id,
            name: line.name,
            //students: line.students,
            color: line.color,
            stops: line.stops,
            schoolId: line.schoolId
        };
    });
    res.status(200).json(lines);
});

router.get('/:id', async (req, res) => {
    let line;
    try{
        line = await Line.findById(req.params.id);
        if (!line) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/lines/' + line.id,
            id: line.id,
            name: line.name,
            //students: line.students,
            color: line.color,
            schoolId: line.schoolId,
            stops: line.stops
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
    
});


// post gestibile solamente dall'admin? da implementare
router.post('', async (req, res) => {

	let line = new Line({
        name: req.body.name,
        //students: line.students,
        color: req.body.color,
        schoolId: req.body.schoolId,
        stops: req.body.stops
    });
    
	line = await line.save();
    let lineId = line.id;
    console.log('Line saved successfully');

    res.location("/api/v1/lines/" + lineId).status(201).json(line).send();
});

router.put('/:id', async (req, res) => { //modifica oggetto specifico
    let line;
    try {
        const { id } = req.params;
        line = await Line.findByIdAndUpdate(id, req.body);

        if(!line) {
            return res.status(404).send("Line not found");
        }
        const update = await Line.findById(id);
        res.status(200).json(update);

    } catch (err) {
        res.status(500).send("500 Internal Server Error");
    }
});

// delete gestibile solamente dall'admin? da implementare
router.delete('/:id', async (req, res) => {
    let line = await Line.findById(req.params.id).exec();
    if (!line) {
        res.status(404).send('line not found');
        console.log('line not found');
        return;
    }
    await line.deleteOne();
    console.log('line removed');
    res.status(204).send();
});

module.exports = router;
