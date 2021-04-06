const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const Gallerydb = require('../models/gallerymodel');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    dest : 'uploads',
    limits : {
        fileSize : 300000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPEG)$/))
        {
            return cb(new Error('Please upload an image'));
        }
        

        cb(undefined, true);
    },   
})


router.post('/gallery', auth, upload.single('images'), async (req, res) => {

    try {
        const obj = {
            gallerimage : fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename))
        }
        
        const gallery = new Gallerydb(obj);
        await gallery.save();
    }
    catch (error) {
        res.status(400).send({ error : error.message });
    }

    // for removing the local uploads directory after storing it on the database !!
    try {
        fs.rmdirSync(path.join(__dirname + '/../uploads'), {recursive : true});
    }
    catch (error)
    {
        console.log(error.message);
    }


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

        res.set('Content-Type', 'image/jpg');
        res.send(gallery);
    }
    catch (error) 
    {
        res.status(400).send({ error : error.message });
    }
})


module.exports = router;