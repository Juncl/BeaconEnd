var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api', function(request, response) {
   response.send({name:"Junc",age:40,time:new Date().getTime()});
});



module.exports = router;
