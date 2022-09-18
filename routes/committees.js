
const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');
const Delegate = require('../models/Delegate');
const sgMail = require('@sendgrid/mail')



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


// For delegate registration page
// gets all committee (names)
router.get('/', async (req, res) => {
    try {
        const committees = await Committee.find().select("name");
        res.json(committees);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})


// For secretariat setup screen
router.post('/add', async (req, res) => {
    const newCommittee = new Committee({
        name: req.body.name,
        countries: []
    })

    try {
        const insertedCommittee = await newCommittee.save()
        return res.status(201).json(insertedCommittee);
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
})




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

        const delegateInDB = await Delegate.findById(req.params.delegate_id)
        delegateInDB.assignment = req.params.assignment_id
        await delegateInDB.save()

        

        // Send email to assigned delegate notifying of their assignment

        const MESSAGE = 'You have been assigned to a country. Log into campus to view at campus.cahsmun.org'
        const SUBJECT = 'CAHSMUN Delegate Assignment'
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
        const templateId = 'd-04077bfcad034ee98b45be80acd2e17a'

        const msg = {
            from: {
                email: 'delegates@cahsmun.org',
                name: 'CAHSMUN Campus'
            },
            personalizations: [
                {
                    to: [
                        {
                            email: delegateInDB.email
                        }
                    ],
                    dynamic_template_data: {
                        subject: SUBJECT,
                        email_content: MESSAGE
                    }
                },
            ],
            template_id: templateId
        }

        return sgMail
            .send(msg)
            .then(() => {
                return res.status(200).json({ message: 'Email sent'})
            })
            .catch((error) => {
                console.log(error)
                return res.status(500).json({ message: error})
            })
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
})

router.post('/unassign/:committee_id/:assignment_id/:delegate_id', async(req, res) => {

    try {
        res.assignment = Committee.findById(req.params.committee_id).then(doc => {
            country = doc.countries.id(req.params.assignment_id);
            country["assigned"] = "";
            doc.save();
        })
        
        const delegateInDB = await Delegate.findById(req.params.delegate_id)
        delegateInDB.assignment = ''
        await delegateInDB.save()

        res.json(res.assignment);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
})


router.patch('/edit/:committee_id/countries', async (req, res) => {
    
    if(!req.params.committee_id) {
        return res.status(400).json({
            message: 'No committee id provided'
        })
    }

    const committeeInDB = await Committee.findById(req.params.committee_id)

    committeeInDB.countries = req.body.countries

    try {
        const editedCommittee = await committeeInDB.save()
        res.status(200).json(editedCommittee)
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong while saving new committee: ${JSON.stringify(error)}`
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