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
  res.json({success: true, message: 'pepelaugh'});
})

module.exports = router;
