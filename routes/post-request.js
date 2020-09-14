var express = require('express');
var router = express.Router();

router.get('*', (req, res, next) => {
    next();
    // post request functions
});

module.exports = router;
