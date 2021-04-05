const express = require('express');
const User = require('../models/usermodel');
const auth = require('../middleware/auth');
const router = express.Router();


//Update Name
//Update no
//Update password
//get all videos

router.get('/users/me', auth, (req, res) => {
    res.send(req.user);
});


router.post('/users/signup', async (req, res) => {
    const user = new User(req.body);

    try
    {
        await user.save();
        const user = await User.findByCredentials(req.body.uid, req.body.password);
        const token = await user.generateAuthToken(); 
        res.send({user, token});
    }
    catch (error)
    {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try
    {
        const user = await User.findByCredentials(req.body.uid, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }
    catch (error)
    {
        res.status(400).send({ error : 'Some Error in login' });
    }
});


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((individuslToken) => {
            return individuslToken.token !== req.token;
        });
        await req.user.save();
        res.send('Successfully Logged out');
    } catch (error) {
        res.status(500).send({ error : 'Some error in logging out' });
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Logged Out of All devices');
    } catch (error) {
        res.status(500).send({ error : 'Unable to logout' });
    }
});


module.exports = router;