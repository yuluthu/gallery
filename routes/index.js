var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Express', pageScripts});
});

router.get('/gallery', async (req, res, next) => {
  pageScripts.push('gallery/gallery.js');
  
  let filesCollection = connection.collection('files');
  let files = await filesCollection.find({status: 1}).toArray()
  files = files.map(v => {
    v.isImage = coreFunctions.isImage(v.fileType);
    return v;
  });
  res.render('gallery', { title: 'Yulu Gallery', pageScripts, files});
});

router.get('/test', (req, res, next) => {
  res.json({
    title: 'Heck',
    success: true,
    data: {
      yeet: 'yeet'
    }
  });
});

module.exports = router;
