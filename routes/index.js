var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(
      'index',
      {
          title: `Never forget who you are, the rest of the world will not. 
                  Wear it like armor and it will never be used to hurt you.`,
          welcome: `the World.`,
          domain: configs.domain,
          port: configs.port
      }
  );
});

module.exports = router;
