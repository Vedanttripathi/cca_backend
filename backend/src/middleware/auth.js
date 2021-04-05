const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const auth = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'miljonir');
        const user = await User.findOne({ uid: decoded._id, 'tokens.token': token });

        if (!user)
        {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error : "User not Authorized" });
    }
    
};

module.exports = auth;