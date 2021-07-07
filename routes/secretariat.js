// create secretariat (temp)
// view all secretariats
// view secretariat
// edit secretariat
// remove secretariat

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Secretariat = require('../models/Secretariat');
const verify = require('../middleware/tokenVerify');

// Get One
router.get('/:id', verify, getSecretariat, (req, res) => {
    res.json(res.sec);
});


// Get All
router.get('/', verify, async (req, res) => {
    try {
        const secretariats = await Secretariat.find();
        res.json(secretariats);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Create
router.post('/', async (req, res) => {
    // TODO: Check duplicate

    const salt = await bcrypt.genSalt(10);
    const hashedPasscode = await bcrypt.hash(req.body.passcode, salt);

    const secretariat = new Secretariat({
        name: req.body.name,
        position: req.body.position,
        email: req.body.email,
        passcode: hashedPasscode,
    });

    try {
        const newSecretariat = await secretariat.save();
        res.status(201).json(newSecretariat);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});


// Update (Patch)
router.patch('/:id', verify, getSecretariat, async (req, res) => {
    if (req.body.email != null) {

        const secEmailExists = await Secretariat.findOne({email: req.body.email});
        if(secEmailExists) return res.status(400).json({ message: 'Email already in use'});

        res.sec.email = req.body.email;
    }
    if (req.body.position != null) {
        res.sec.position = req.body.position;
    }
    if (req.body.email != null) {
        res.sec.email = req.body.email;
    }
    if (req.body.passcode != null) {

        const salt = await bcrypt.genSalt(10);
        const hashedPasscode = await bcrypt.hash(req.body.passcode, salt);

        res.sec.passcode = hashedPasscode;
    }
    res.sec.lastUpdated = Date.now();

    try {
        const updatedSecretariat = await res.sec.save();
        res.json(updatedSecretariat);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
});


// Delete
router.delete('/:id', verify, getSecretariat, async (req, res) => {
    try {
        await res.sec.remove();
        res.json({
            message: 'Secretariat deleted successfully.'
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
});



async function getSecretariat(req, res, next) {
    let sec;

    try {
        sec = await Secretariat.findById(req.params.id);
        if (sec == null) {
            return res.status(404).json({
                message: `Cannot find customer with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.sec = sec;
    next();
}

module.exports = router;