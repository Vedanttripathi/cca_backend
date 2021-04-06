const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Make all the fields in a differrnt model and use uid's to retrieve the details of it !!

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    uid : {
        type : Number,
        unique : true,
        required : true,

    },
    password : {
        type : String,
        required : true,
        minlength : 7,
        trim : true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
            {
                throw new Error("Password cannot be 'password'.");
            }
        }
    },
    user_type : {
        type : String
    },
    email : {
        type : String,
        trim : true,
        vslidate (value) {
            if (validator.isEmail(value))
            {
                throw new Error('Email is not valid'); 
            }
        }
    },
    tokens : [{
        token : {
            type  : String,
            required : true
        }
    }]
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = await jwt.sign({ _id : user.uid.toString() }, 'miljonir'); //Change this and the auth file to use _id instead of uid. !!
    user.tokens = user.tokens.concat({ token });
    user.save();

    return token;
}


userSchema.method.toJSON = function () {
    const user = this;
    const userobj = user.toObject();

    delete userobj.password;
    delete userobj.tokens;

    return userobj;
}


userSchema.statics.findByCredentials = async (uid, password) => {
    const user = await User.findOne({ uid });
    if (!user)
    {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch)
    {
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);


module.exports = User;