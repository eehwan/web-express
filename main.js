console.time('timer');

const express = require('express');
const app = express();
const port = 5006;

const qs = require('querystring');
const fs = require('fs');

const template = require('./lib/template.js');
// const buttons = require('./lib/buttons.js');

// secrets
const path = require('path');
const sanitizeHtml = require('sanitize-html');

//application-level middleware
const bodyParser = require("body-parser");
const compression = require("compression");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression());
//self-made middleware
app.get('*', function(req,res, next){
  fs.readdir('./data', function(error, filelist){
    req.list = filelist;
    next();
  })
});

//Router
const topicRouter = require('./routes/topic');
app.use('/topic', topicRouter);


//home
app.get('/', function(req, res){
  var title = 'Welcome';
  var description = 'made with Node.js & Express';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    '<a href="/post">post</a>'
  );
  res.send(html);
});

//page-read
app.get('/page/:page', function(req, res, next){
  var filteredId = path.parse(req.params.page).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    if (!err){
      var sanitizedTitle = sanitizeHtml(filteredId);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['a']
      });
      var list = template.list(req.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `<a href="/post">post</a>
        <a href="/modify/${sanitizedTitle}">modify</a>
        <form action="/delete_process" method="post">
      <input type="hidden" name="id" value="${sanitizedTitle}">
      <input type="submit" value="delete">
      </form>`
      );
      res.send(html);
    }
    else{
      next(err);
    }
  });
});
//post
app.get('/post', (req, res) => {
  var title = 'WEB - Post';
  var list = template.list(req.list);
  var html = template.HTML(title, list, `
    <form action="/post_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `, '');
  res.send(html);
});
//post_process
app.post('/post_process', function(req,res){
    var query = req.body;
    var title = query.title;
    filteredTitled = path.parse(title).base;
    var description = query.description;
    fs.writeFile(`data/${filteredTitled}`, description, 'utf-8', function(err){
      res.redirect(`/page/${filteredTitled}`)
    });
});
//modify
app.get('/modify/:title', function(req,res){
  fs.readdir('./data', function(error, filelist){
    var title = req.params.title;
    fs.readFile(`data/${title}`, 'utf8', function(err, description){
      var list = template.list(filelist);
      var html = template.HTML(title, list,
         `
         <form action="/modify_process" method="post">
           <input type="hidden" name="ex_title" value="${title}">
           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
           <p>
             <textarea name="description" placeholder="description">${description}</textarea>
           </p>
           <p>
             <input type="submit">
           </p>
         </form>
         `,
         `<a href="/post">post</a> <a href="/modify/${title}">modify</a>`
      );
      res.send(html);
     });
   });
});
//modify_process
app.post('/modify_process/', function(req,res){
  var query = req.body;
  var ex_title = query.ex_title;
  var title = query.title;
  var description = query.description;
  fs.rename(`data/${ex_title}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.redirect(`/page/${title}`)
    })
  });
});
//delete_process
app.post('/delete_process', function(req,res){
  var query = req.body;
  var id = query.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    res.redirect('/');
  })
});

//error_page
app.use(function(err, req, res, next){
  console.error(err);
  // res.status(404).send("<script>\
  //    alert('page not found');\
  //    history.go(-1);\
  //    </script>");
  res.send(`<script>
     alert("${err.stack}");
     history.go(-1);
     </script>`);
});
// app.use(function(req, res, next){
//   res.send("<script>\
//      alert('page not found');\
//      history.go(-1);\
//      </script>");
// });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
console.timeEnd('timer');
