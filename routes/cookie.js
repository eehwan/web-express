const express = require('express');
const router = express.Router();
// const cookieParser = require('cookie-parser');
// router.use(cookieParser());

// router.get('/:id', function(req, res, next){
//   if(!err){
//     res.send(`Hello, ${req.params.id} !! `)
//     }
//   else{
//     res.next();
//     }
// });
router.get('/',function(req, res, next){
  if(req.cookies == undefined|| null|| ""|| (req.cookies != null && typeof req.cookies == "object" && !Object.keys(req.cookies).length)){
    res.cookie('first', "1", {maxAge: 30000});
    res.cookie('time', new Date(), {maxAge: 30000});
    res.send('Hello, Cookie !!<br>\
    setting...');
  }
  else{
    res.send(`Cookie <br>\
      ${Object.keys(req.cookies)}<br>\
      ${JSON.stringify(req.cookies)}`);
  }
})

router.use(function(err, req, res, next){
  res.send(`<script>
     alert("${err.stack}");
     history.go(-1);
     </script>`);
});
router.use(function(req, res){
  res.send(`<script>
     alert("Unknown Error");
     history.go(-1);
     </script>`);
});

module.exports = router
