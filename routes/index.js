var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Express', pageScripts});
});

router.get('/gallery',(req, res, next) => {
  pageScripts.push('gallery/gallery.js');
  connection.query('SELECT * FROM files WHERE status = 1', [], (error, result) => {
    res.render('gallery', { title: 'Yulu Gallery', pageScripts, files: result.map(v => {
      v.isImage = coreFunctions.isImage(v.fileType);
      return v;
    })});
  });
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
