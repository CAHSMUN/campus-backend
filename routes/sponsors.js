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


// Get one sponsor (sponsor detail screen)
router.get('/:id', verify, getSponsor, async (req, res) => {
    res.json(res.sponsor);
})

async function getSponsor(req, res, next) {
    let sponsor;

    try {
        sponsor = await Sponsor.findById(req.params.id);
        if (sponsor == null) {
            return res.status(404).json({
                message: `Cannot find sponsor with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.sponsor = sponsor;
    next();
}


module.exports = router;