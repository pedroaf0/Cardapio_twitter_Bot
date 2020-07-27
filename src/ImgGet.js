var request = require("request");
var http = require('https');
var fs = require('fs');

module.exports.ImgGet = ()=> new Promise((re,err)=>{
request("https://ifrs.edu.br/sertao/wp-json/wp/v2/media?search=cardapio", function (error, response, body) {
   console.log(JSON.parse(body)[0].guid.rendered)
   download(JSON.parse(body)[0].guid.rendered, './img/original/img.jpg', () => re(JSON.parse(body)[0].guid.rendered))

})
})

const download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
   http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};



