var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:fileId', (req, res, next) => {
    console.log(req.params.fileId);
    connection.query('SELECT * FROM `files` WHERE `id` = ?', req.params.fileId, (err, result) => {
        result = result[0];
        if (result) {
            var options = {
                root: './public',
                dotfiles: 'deny',
                headers: {
                  'x-timestamp': Date.now(),
                  'x-sent': true
                }
              }
            res.sendFile('/uploads/' + result.fileName, options);
        }
    });
});


module.exports = router;
