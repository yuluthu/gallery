var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Express', pageScripts});
});

router.get('/test', (req, res, next) => {
  res.json({
    title: 'Heck',
    success: true,
    data: {
      yeet: 'yeet'
    }
  });
  console.log(res)
});

module.exports = router;
