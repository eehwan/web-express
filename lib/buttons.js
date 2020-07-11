module.exports = {
  post : function(){
    return '<a href="/post">post</a>'
  },
  modify : function(){
    `<a href="/modify/${sanitizedTitle}">modify</a>`
  },
  delete : function(){
    `<form action="/delete_process" method="post">\
  <input type="hidden" name="id" value="${sanitizedTitle}">\
  <input type="submit" value="delete">\
  </form>`
  }
}
