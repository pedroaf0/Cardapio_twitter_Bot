const request = require("request");
const cheerio = require('cheerio');
const https = require('https');
const fs = require('fs');



const ImgGet = () => new Promise(async(re,err)=>{

    try{
      request("https://ifrs.edu.br/sertao/assistencia-estudantil/restaurante/cardapio/", function (error, response, body) {
        // console.log(body)
         const $ = cheerio.load(body);
         imgsrc = $('body > section > div > div.col-12.col-lg-10 > main > article > div:nth-child(3) > div > div > p > img').get()[0].attribs['data-src']
         const file = fs.createWriteStream("./img/original/img.jpg");
         const request = https.get(imgsrc, function(response) {
           response.pipe(file);
           re();
     
     }) 

})
    }catch(e){
      ImgGet();
    }       
});

module.exports.ImgGet = ImgGet;
