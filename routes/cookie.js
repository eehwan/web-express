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
router.get('/',function(req,res){
  if(req.cookies.first){
    let _cookie = JSON.stringify(req.cookies)
    res.send(_cookie)
  }
  else{
    res.cookie('first', "1", {maxAge: 30000});
    res.send('Hello, Cookie !!');
  }
})

router.use(function(err, req, res, next){
  res.send(`<script>
     alert("${err.stack}");
     history.go(-1);
     </script>`);
});

module.exports = router
