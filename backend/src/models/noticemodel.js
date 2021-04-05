const mongoose = require('mongoose');


const Notice = mongoose.model('Notice', {
    notice : {
        type : String
    },
});

module.exports = Notice;