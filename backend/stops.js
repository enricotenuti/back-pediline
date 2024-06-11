const express = require('express');
const router = express.Router();
const Stop = require('./models/stop');


router.get('', async (req, res) => {
    let stops;

    if (req.query.line)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        stops = await Stop.find({line: req.query.line}).sort({ schedule: 1 }).exec();
    else
        stops = await Stop.find().exec();

    stops = stops.map( (stop) => {
        return {
            self: '/api/v1/stops/' + stop.id,
            id: stop.id,
            name: stop.name,
            schedule: stop.schedule,
            position: stop.position,
            line: stop.line
        };
    });
    res.status(200).json(stops);

    

});

router.get('/:id', async (req, res) => {
    let stop;
    try {
        stop = await Stop.findById(req.params.id);    
        if (!stop) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/stops/' + stop.id,
            id: stop.id,
            name: stop.name,
            schedule: stop.schedule,
            position: stop.position,
            line: stop.line
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }

});

router.post('', async (req, res) => {

	try {
        let stop = new Stop({
            name: req.body.name,
            schedule: req.body.schedule,
            position: req.body.position,
            line: req.body.line
        });

        stop = await stop.save();
        let stopId = stop.id;
        console.log('Stop saved successfully');

        res.location("/api/v1/stops/" + stopId).status(201).json(stop).send();
        } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    let stop = await Stop.findById(req.params.id).exec();
    if (!stop) {
        res.status(404).send('Stop not found');
        console.log('Stop not found');
        return;
    }
    await stop.deleteOne();
    console.log('Stop removed');
    res.status(204).send();
});

module.exports = router;


router.put('/:id', async (req, res) => {
    let stop;
    try {
        const { id } = req.params;
        stop = await Stop.findByIdAndUpdate(id, req.body);

        if(!stop) {
            return res.status(404).send("Stop not found");
        }
        const update = await Stop.findById(id);
        res.status(200).json(update);

    } catch (err) {
        console.log("API:", req.body);
        res.status(500).send("500 Internal Server Error");
    }
});