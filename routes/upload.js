var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    pageScripts.push('upload/upload.js')
    console.log('yeet')
    res.render('upload', { title: 'Upload a File', pageScripts});
    res.title = 'Upload a File';
});

router.post('/uploadFile', (req, res, next) => {
    if (!req.files) {
        res.json({success: false, errorMsg: 'No file uploaded!'});
    } else {
        let file = req.files.file;
        connection.query('INSERT INTO `files` (`fileName`) VALUES (?)', ['' + file.name], (error, results, fields) => {
            if (error) throw error;
            var filename = './public/uploads/' + file.name;
            file.mv(filename);
            res.json({success: true, fileId: results.insertId, filename: file.name});
        });

    }
})

module.exports = router;
