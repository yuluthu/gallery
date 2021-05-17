var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:fileId', async (req, res, next) => {
    let filesCollection = connection.collection('files');
    let result = await filesCollection.findOne({_id: ObjectId(req.params.fileId)});
    if (result) {
      var options = {
        root: './public',
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
      res.sendFile('/uploads/' + result.storedName, options);
    } else {
      res.json({success: false, error: 'not found'})
    }
});


module.exports = router;
