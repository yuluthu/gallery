var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    pageScripts.push('upload/upload.js')
    res.render('upload', { title: 'Upload a File', pageScripts});
    res.title = 'Upload a File';
});

router.post('/uploadFile', (req, res, next) => {
    if (!req.files) {
        res.json({success: false, errorMsg: 'No file uploaded!'});
    } else {
        let file = req.files.file;
        var storedName = coreFunctions.getFilename(file.name)
        var path = './public/uploads/' + storedName;

        connection.query('SELECT * FROM files WHERE md5 = ? AND status = 1', [file.md5], (err, result) => {
            if (result.length) {
                result = result[0];
                res.json({success: true, fileId: result.id, filename: result.fileName, storedName: result.storedName, isImage: coreFunctions.isImage(file.mimetype)});
            } else {
                connection.query('INSERT INTO `files` (`fileName`, `storedName`, `fileType`, `md5`) VALUES (?, ?, ?, ?)', ['' + file.name, '' + storedName, '' + file.mimetype, '' + file.md5], (error, results, fields) => {
                    if (error) throw error;
                    file.mv(path);
                    res.json({success: true, fileId: results.insertId, filename: file.name, storedName, isImage: coreFunctions.isImage(file.mimetype)});
                });
            }
        });
    }
})

module.exports = router;
