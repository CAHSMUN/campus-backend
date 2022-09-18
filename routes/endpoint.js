// stripe listener
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req)
    res.status(200)
})

module.exports = router;