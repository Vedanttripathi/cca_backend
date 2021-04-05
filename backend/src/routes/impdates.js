const express = require('express');
const Impdates = require('../models/datemodel');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/dates', (req, res) => {
    Impdates.find({}).then((dates) => {
        res.send(dates.slice(0, 4));
    }).catch((error) => {
        res.status(500).send({ error : 'Failed to load all the users' });
    });
});


router.post('/dates/new', auth, async (req, res) => {
    try {
        const date = new Impdates(req.body);
        await date.save();
        res.send({ message : 'Date Successfully added' });
    }
    catch (error) {
        res.status(400).send({ error : error.message });
    }
});


router.delete('/dates/delete/:id', auth, async (req, res) => { // Instead of id delete by date and update by date too !!
    const _id = req.params.id;
    try {
        await Impdates.findByIdAndDelete({ _id });
        res.send({ message : 'Date deleted' });
    }
    catch (error) {
        res.status(400).send({ error : error.message });
    }
});


// Create the update route !!

module.exports = router;