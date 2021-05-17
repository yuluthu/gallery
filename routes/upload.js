let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    pageScripts.push('upload/upload.js')
    res.render('upload', { title: 'Upload a File', pageScripts});
    res.title = 'Upload a File';
});

router.post('/uploadFile', async (req, res, next) => {
    if (!req.files) {
        res.json({success: false, errorMsg: 'No file uploaded!'});
    } else {
        let file = req.files.file;
        let storedName = coreFunctions.getFilename(file.name)
        let path = './public/uploads/' + storedName;

        let filesCollection = connection.collection('files');

        let result = await filesCollection.findOne({md5: file.md5, status: 1})

        if (result) {
            res.json({success: true, fileId: result._id, filename: result.fileName, storedName: result.storedName, isImage: coreFunctions.isImage(file.mimetype)});
        } else {
            let insert = await filesCollection.insertOne({fileName: file.name, storedName, dateUploaded: new Date(), fileType: file.mimetype, md5: file.md5, status: 1});
            file.mv(path);
            res.json({success: true, fileId: insert.insertedId, filename: file.name, storedName, isImage: coreFunctions.isImage(file.mimetype)});
        }
    }
})

module.exports = router;
