
var request = require("request");
var cheerio = require('cheerio');
var http = require('https');
var fs = require('fs');

module.exports.ImgGet = ()=> new Promise((re,err)=>{
request("https://ifrs.edu.br/sertao/assistencia-estudantil/restaurante/cardapio/", function (error, response, body) {
   // console.log(body)
    const $ = cheerio.load(body);
    imgsrc = $('body > section > div > div.col-12.col-lg-10 > main > article > div:nth-child(3) > div > div > p > img').get()[0].attribs['data-src']
   console.log(imgsrc)
   download(imgsrc, './img/original/img.jpg', re)

})
})

const download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};


