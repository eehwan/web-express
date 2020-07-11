module.exports = {
  post: '<a href="/post">post</a>',
  modify: '<a href="/modify/${sanitizedTitle}">modify</a>',
  delete: '<form action="/delete_process" method="post">\
  <input type="hidden" name="id" value="${sanitizedTitle}">\
  <input type="submit" value="delete">\
  </form>'
}
