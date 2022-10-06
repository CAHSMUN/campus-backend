// create delegate (registration) (email event)
// view delegate
// view all delegates
// update delegate
// delete delegate
// assign delegate


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const verify = require('../middleware/tokenVerify');
const Sponsor = require('../models/Sponsor');
const School = require('../models/School');
const Delegate = require('../models/Delegate');
const sgMail = require('@sendgrid/mail')


// regular registration
router.post('/register/regular', async (req, res) => {
    // simple post

    const delegate = new Delegate({
        attendance: req.body.attendance, 
        capacity: req.body.capacity,
        email: req.body.email,
        passcode: req.body.passcode,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        grade: req.body.grade,
        school: req.body.school, 
        sex: req.body.sex,
        phoneNumber: req.body.phoneNumber,
        postal: req.body.postal,
        refereePosition: req.body.refereePosition,
        refereeName: req.body.refereeName,
        ec_firstName: req.body.ec_firstName,
        ec_lastName: req.body.ec_lastName,
        ec_relationship: req.body.ec_relationship,
        ec_phoneNumber: req.body.ec_phoneNumber,
        prefOneComm: req.body.prefOneComm, 
        prefOneCountry: req.body.prefOneCountry,
        prefTwoComm: req.body.prefTwoComm, 
        prefTwoCountry: req.body.prefTwoCountry,
        prefThreeComm: req.body.prefThreeComm, 
        prefThreeCountry: req.body.prefThreeCountry,
        numPrevConferences: req.body.numPrevConferences, 
        pastConferences: req.body.pastConferences, 
        signature: req.body.signature,
        prefReason: req.body.prefReason,
        assignment: ''
    });

    try {
        const newDelegate = await delegate.save();


        // Send email of successfully registered
        const MESSAGE = 'You have successfully registered for CAHSMUN. Log into campus to view at campus.cahsmun.org'
        const SUBJECT = 'CAHSMUN Delegate Registration'
        
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
                            email: newDelegate.email
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
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
})


// head delegate registration
router.post('/register/head', async (req, res) => {

    // find delegate
    
    let delegate;

    try {
        delegate = await Delegate.findOne({ email: req.body.email })
        if (delegate == null) {
            return res.status(404).json({
                message: `Cannot find delegate with email ${req.body.email}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.delegate = delegate

    // update delegate of email `req.body.email` with all information (minus email and passcode)

    
    res.delegate.attendance = req.body.attendance
    res.delegate.capacity = req.body.capacity
    res.delegate.firstName = req.body.firstName
    res.delegate.lastName = req.body.lastName
    res.delegate.grade = req.body.grade
    res.delegate.sex = req.body.sex
    res.delegate.phoneNumber = req.body.phoneNumber
    res.delegate.postal = req.body.postal
    res.delegate.refereePosition = req.body.refereePosition
    res.delegate.refereeName = req.body.refereeName
    res.delegate.ec_firstName = req.body.ec_firstName
    res.delegate.ec_lastName = req.body.ec_lastName
    res.delegate.ec_relationship = req.body.ec_relationship
    res.delegate.ec_phoneNumber = req.body.ec_phoneNumber
    res.delegate.prefOneComm = req.body.prefOneComm
    res.delegate.prefOneCountry = req.body.prefOneCountry
    res.delegate.prefTwoComm = req.body.prefTwoComm
    res.delegate.prefTwoCountry = req.body.prefTwoCountry
    res.delegate.prefThreeComm = req.body.prefThreeComm
    res.delegate.prefThreeCountry = req.body.prefThreeCountry
    res.delegate.numPrevConferences = req.body.numPrevConferences
    res.delegate.pastConferences = req.body.pastConferences
    res.delegate.signature = req.body.signature
    res.delegate.prefReason = req.body.prefReason
    res.delegate.assignment = ''

    try {
        const updatedDelegate = await res.delegate.save();




        // Send email of successfully registered
        

        const MESSAGE = 'You have successfully registered for CAHSMUN. Log into campus to view at campus.cahsmun.org'
        const SUBJECT = 'CAHSMUN Delegate Registration'
        
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
                            email: updatedDelegate.email
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
    } catch (error) {
        res.status(400).json({
            message: err.message
        })
    }

})



// Get all delegates with just _id and name returns (secretariat matrix view)
router.get('/map', verify, async (req, res) => {
    try {
        const delegates = await Delegate.find({}, { firstName: 1, lastName: 1 })
        res.json(delegates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

// Get all delegates (delegates list screen)
router.get('/', verify, async (req, res) => {
    try {
        const delegates = await Delegate.find();
        res.json(delegates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

// Get one delegate (delegate detail screen)
router.get('/:id', verify, getDelegate, async (req, res) => {
    res.json(res.delegate);
})

router.delete('/:id', verify, getDelegate, async(req, res) => {
    try {
        await res.delegate.remove();
        return res.status(200).json({
            message: 'Deleted successfully'
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})






async function getDelegate(req, res, next) {
    let delegate;

    try {
        delegate = await Delegate.findById(req.params.id);
        if (delegate == null) {
            return res.status(404).json({
                message: `Cannot find delegate with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.delegate = delegate;
    next();
}


module.exports = router;