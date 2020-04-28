const puppeteer = require('puppeteer');
const fs = require('fs');



const ImgGet = () => new Promise(async(re,err)=>{

    try{
            const browser = await puppeteer.launch({
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
              ]
            }
          );
            const page = await browser.newPage();

            await page.goto('https://ifrs.edu.br/sertao/assistencia-estudantil/restaurante/cardapio/');
            var imgsrc = await page.evaluate("document.querySelector('body > section > div > div.col-12.col-lg-10 > main > article > div:nth-child(3) > div > div > p > img').src;");
            var txt = await page.evaluate("document.querySelector('body > section > div > div.col-12.col-lg-10 > main > article > div:nth-child(4) > div > p').innerText;");
            console.log(imgsrc);
            viewSource = await page.goto(imgsrc);
          fs.writeFile("./img/original/img.jpg", await viewSource.buffer(), function (err) {
            if (err) console.log(err);

            console.log("Cardapio.jpg was saved!");
            re();
          });
                browser.close();
        }catch(e){
          ImgGet();
        }       
});

module.exports.ImgGet = ImgGet;
