// stripe listener
const express = require('express');
const Delegate = require('../models/Delegate');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req)

    const payment_id = req.body.data.object.id
    const customer_email = req.body.data.object.customer_email

    try {

        const delegate = await Delegate.findOne({ email: customer_email })
        delegate.paymentId = payment_id
        await delegate.save()

        return res.status(200).json({
            message: `Saved user ${customer_email} with payment ID ${payment_id}`
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
    
    res.status(200)
})

module.exports = router;