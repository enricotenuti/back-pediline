/* Il codice delle API di Calendar è stato stilato ma non è ancora stato implementato. */
const express = require('express');
const router = express.Router();
const Calendar = require('./models/calendar');

router.get('', async (req, res) => {
    let calendars = await Calendar.find({});
    calendars = calendars.map( (calendar) => {
        return {
            self: '/api/v1/calendars/' + calendar.id,
            listePresenze: calendar.listePresenze,
            bacheca: calendar.bacheca
        };
    });
    res.status(200).json(calendars);
});

router.get('/:id', async (req, res) => {
    let calendar;
    try{
        calendar = await Calendar.findById(req.params.id);
        if (!calendar) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/calendars/' + calendar.id,
            id: calendar.id,
            listePresenze: calendar.listePresenze,
            bacheca: calendar.bacheca
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
    
});


router.post('', async (req, res) => {

	let calendar = new Calendar({
        listePresenze: req.body.listePresenze,
        bacheca: req.body.bacheca
    });
    
	calendar = await calendar.save();
    let calendarId = calendar.id;
    console.log('Calendar saved successfully');

    res.location("/api/v1/calendars/" + calendarId).status(201).json(calendar).send();
});

router.delete('/:id', async (req, res) => {
    let calendar = await Calendar.findById(req.params.id).exec();
    if (!calendar) {
        res.status(404).send('Calendar not found');
        console.log('Calendar not found');
        return;
    }
    await calendar.deleteOne();
    console.log('Calendar removed');
    res.status(204).send();
});

module.exports = router;
