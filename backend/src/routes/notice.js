const express = require('express');
const Notice = require('../models/noticemodel');
const router = express.Router();



router.get('./notice', (req, res) => {
    Notice.find({}).then((notice) => {
        res.send(notice);
    }).catch((error) => {
        res.status(500).send({ error : 'Failed to load all the notices' });
    });
});


router.post('/notice', (req, res) => {
    const notice = new Notice(req.body);

    notice.save().then(() => {
        res.send({ message : 'Notice added' });
    }).catch(() => {
        res.status(400);
        res.send({ error : 'Failed to add notice' });
    });
});


router.delete('/notice/delete/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        await Notice.findByIdAndDelete({ _id });
        res.send({ message : 'Notice Successfully deleted' });
    }
    catch (error)
    {
        res.status(400).send({ error : error.message });
    }
});


module.exports = router;