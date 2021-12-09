
const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');



// For public country matrix page
router.get('/matrix', async (req, res) => {
    try {
        const committees = await Committee.find();
        res.json(committees);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});




// For assigning

// TODO: Add verify middleware for secretariat verification (both assign + unassign)
// TODO: add assign/unassign for delegate object as well
router.post('/assign/:committee_id/:assignment_id/:delegate_id', async (req,res) => {

    try {
        res.assignment = Committee.findById(req.params.committee_id).then(doc => {
            country = doc.countries.id(req.params.assignment_id);
            country["assigned"] = req.params.delegate_id;
            doc.save();
        })
        res.json(res.assignment);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/unassign/:committe_id/:assignment_id', async(req, res) => {

    try {
        res.assignment = Committee.findById(req.params.committee_id).then(doc => {
            country = doc.countries.id(req.params.assignment_id);
            country["assigned"] = "";
            doc.save();
        })
        res.json(res.assignment);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
})






// ------------------ NOTE: Setup only -----------------

// Create new committee w/ array of countries ( POST: committees/create )
router.post('/create', async(req, res) => {

    let country_array = req.body.countries;
    let committee_countries = []

    for (let i = 0; i < country_array.length; i++) {
        committee_countries.push({
            name: country_array[i],
            assigned: ""
        })
    }

    console.log(committee_countries)
    
    const committee = new Committee({
        name: req.body.name,
        countries: committee_countries
    });
    
    try {
        const newCommittee = await committee.save();
        res.status(201).json(newCommittee);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
})


// async function getCommittee(req, res, next) {
//     let committee;

//     try {
//         committee = await Committee.findById(req.params.committee_id);
        
//         // TODO: just get object w given id singly

//         // console.log(committee)

//         if (committee == null) {
//             return res.status(404).json({
//                 message: `Cannot find document id ${req.params.committee_id}`
//             });
//         }
//     } catch (err) {
//         return res.status(500).json({
//             message: err.message
//         });
//     }

//     res.committee = committee;
//     next();
// }



module.exports = router;