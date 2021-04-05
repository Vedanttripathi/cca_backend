const mongoose = require('mongoose');


const gallerySchema = mongoose.Schema({
    gallerimage : {
        type : Buffer
    },
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;