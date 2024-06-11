/* Il codice delle API di List è stato stilato ma non è ancora stato implementato. */
const express = require('express');
const router = express.Router();
const List = require('./models/list'); 

router.get('', async (req, res) => {
    let lists = await List.find({});
    lists = lists.map( (list) => {
        return {
            self: '/api/v1/lists/' + list.id,
            day: list.day,
            leaders: list.leaders,
            studentsPresent: list.studentsPresent,
            studentsAbsent: list.studentsAbsent
        };
    });
    res.status(200).json(lists);
});

router.get('/:id', async (req, res) => {
    let list;
    try {
        list = await List.findById(req.params.id);
        if (!list) {
            res.status(404).send("404 not found");
            return;
        }
        res.status(200).json({
            self: '/api/v1/lists/' + list.id,
            id: list.id,
            day: list.day,
            leaders: list.leaders,
            studentsPresent: list.studentsPresent,
            studentsAbsent: list.studentsAbsent
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("500 Internal Server Error");
        return;
    }
    
});




router.post('', async (req, res) => {

	let list = new List({
        day: req.body.day,
        leaders: req.body.leaders,
        studentsPresent: req.body.studentsPresent,
        studentsAbsent: req.body.studentsAbsent
    });
    
	list = await list.save();
    let listId = list.id;
    console.log('List saved successfully');

    res.location("/api/v1/lists/" + listId).status(201).json(list).send();
});

router.delete('/:id', async (req, res) => {
    let list = await List.findById(req.params.id).exec();
    if (!list) {
        res.status(404).send('List not found');
        console.log('List not found');
        return;
    }
    await list.deleteOne();
    console.log('List removed');
    res.status(204).send();
});

module.exports = router;
