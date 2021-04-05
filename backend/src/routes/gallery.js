const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const Gallerydb = require('../models/gallerymodel');
// const sharp = require('sharp');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits : {
        fileSize : 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('Please upload an image'));
        }
        

        cb(undefined, true);
    },   
})


router.post('/gallery', auth, upload.single('images'), async (req, res) => {
    const gallery = new Gallerydb(req.file.buffer);
    await gallery.save();
    res.send({ message : 'Image Uploaded successfully' });
}, (error, req, res, next) => {
    res.status(400).send({ error : 'Image upload failed' });
});

router.delete('/gallery/delete/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        await Gallerydb.findByIdAndDelete({ _id });
        res.send({ message : 'Image Successfully deleted'} );
    }
    catch (error) {
        res.status(400).send({ error : error.message });
    }
})


router.get('/gallery', async (req, res) => {
    try
    {
        const gallery = await Gallerydb.find({});

        if (!gallery)
        {
            throw new Error('No photos available');
        }

        res.set('Contrnt-Type', 'image/jpg');
        res.send(gallery);
    }
    catch (error) 
    {
        res.status(400).send({ error : error.message });
    }
})


module.exports = router;