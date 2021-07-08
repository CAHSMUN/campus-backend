// view sponsor
// view all sponsors
// update sponsor
// delete sponsor

const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const verify = require('../middleware/tokenVerify');


// Get all
router.get('/', verify, async (req, res) => {
    try {
        const sponsors = await Sponsor.find();
        res.json(sponsors);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;