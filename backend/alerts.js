const express = require('express');
const router = express.Router();
const Alert = require('./models/alert');

router.get('/', async (req, res) => {
    let alerts = await Alert.find({});
    alerts = alerts.map((alert) => {
        return {
            self: '/api/v1/alerts/' + alert._id,
            id: alert._id,
            title: alert.title,
            description: alert.description,
            date: alert.date,
            author: alert.author
        };
    });
    res.status(200).json(alerts);
});

router.get('/:id', async (req, res) => {
    let alert;
    try {
        alert = await Alert.findById(req.params.id);
        if (!alert) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/alerts/' + alert.id,
            id: alert.id,
            title: alert.title,
            description: alert.description,
            date: alert.date,
            author: alert.author
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
});

router.post('', async (req, res) => {

    let alert = new Alert({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        author: req.body.author
    });

    alert = await alert.save();
    let noticeId = alert.id;
    console.log('Alert saved successfully');

    res.location("/api/v1/alerts/" + noticeId).status(201).json(alert).send();
});

router.delete('/:id', async (req, res) => {
    let alert = await Alert.findById(req.params.id).exec();
    if (!alert) {
        res.status(404).send("Alert not found");
        return;
    }
    await alert.deleteOne();
    res.status(204).send();
});

module.exports = router;