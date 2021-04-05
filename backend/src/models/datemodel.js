const mongoose = require('mongoose');

const Impdates = mongoose.model('Dates', {
    date : {
        type : String,
        required : true,
        trim : true
    },

    description : {
        type : String,
        required : true,
        trim : true
    }
});


module.exports = Impdates;