// view sponsor
// view all sponsors
// update sponsor
// delete sponsor

const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const verify = require('../middleware/tokenVerify');
const Delegate = require('../models/Delegate')


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


// Get stats for dashboard
router.get('/stats/:school_id', verify, async (req, res) => {
    try {
        const delegates = await Delegate.find({ school: req.params.school_id }).countDocuments();
        res.json(delegates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})


// Get delegates list for dashboard
router.get('/delegates/:school_id', verify, async (req, res) => {
    try {
        const delegates = await Delegate.find({ school: req.params.school_id });
        res.json(delegates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})


// Delete one sponsor (sponsor detail screen)
router.delete('/:id', verify, getSponsor, async(req, res) => {
    try {
        await res.sponsor.remove();
        return res.status(200).json({
            message: 'Deleted successfully'
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
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