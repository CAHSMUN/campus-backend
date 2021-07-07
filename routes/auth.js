// login


const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const Secretariat = require('../models/Secretariat');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Delegate = require('../models/Delegate');

/*
    LOGIN
*/
router.post('/login/:type', async(req, res) => {

    const errorMessage = {
        message: 'User with credentials not found',
    }

    if(!req.params.type) return res.status(400).json({ message: 'No login type declared'});


    // SPONSOR LOGIN

    if(req.params.type === 'sponsor') {

        const userInDB = await Sponsor.findOne({email: req.body.email});
        if (!userInDB) return res.status(400).json(errorMessage);
    
        const validPass = await bcrypt.compare(req.body.passcode, userInDB.passcode)
        if(!validPass) return res.status(400).json(errorMessage);
    
        const token = jwt.sign({
            _id: userInDB._id,
            email: userInDB.email,
            role: 'SPONSOR',
            school: userInDB.school,
            name: userInDB.name,
        }, process.env.TOKEN_SECRET);
    
        return res.header('auth-token', token).send(token);
    }


    // SECRETARIAT LOGIN

    if(req.params.type === 'secretariat') {

        const userInDB = await Secretariat.findOne({email: req.body.email});
        if (!userInDB) return res.status(400).json(errorMessage);
    
        const validPass = await bcrypt.compare(req.body.passcode, userInDB.passcode)
        if(!validPass) return res.status(400).json(errorMessage);
    
        const token = jwt.sign({
            _id: userInDB._id,
            email: userInDB.email,
            role: 'SECRETARIAT',
        }, process.env.TOKEN_SECRET);
    
        return res.header('auth-token', token).send(token);
    }


    // SECRETARIAT LOGIN

    if(req.params.type === 'delegate') {

        const userInDB = await Delegate.findOne({email: req.body.email});
        if (!userInDB) return res.status(400).json(errorMessage);
    
        const validPass = await bcrypt.compare(req.body.passcode, userInDB.passcode)
        if(!validPass) return res.status(400).json(errorMessage);
    
        const token = jwt.sign({
            _id: userInDB._id,
            email: userInDB.email,
            role: 'HEAD',
            school: userInDB.school,
        }, process.env.TOKEN_SECRET);
    
        return res.header('auth-token', token).send(token);
    }

    return res.status(400).json({message: `Login type of '${req.params.type}' is unknown`});

});



module.exports = router;