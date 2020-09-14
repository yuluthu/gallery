var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', (req, res, next) => {
    pageScripts = [];
    pageCSS = [];
    now = Date.now();
    next();

    // login functions here?
});

module.exports = router;
