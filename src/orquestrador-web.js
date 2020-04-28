const http = require("http");
const express = require("express");
const fs = require('fs');

const dateFormat = require('dateformat');
const { days, ref } = require('../consts');
const { Post, PostImg } = require('../twitterTimeline');
const { crop } = require('./croper');
const { recognize } = require('./recognize');
const { ImgGet } = require('./ImgGet');
const { GetWeather } = require('./GetWeather');
const app = express();
const port = process.env.PORT || 3333;
app.set('port', port);

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

const server = http.createServer(app);

app.get('/',async (req, res) => {
  return res.json( JSON.parse(fs.readFileSync('cardapio.json').toString()) ); 
 });
 app.get('/new/'+process.env.SECRET_TOKEN,async (req, res) => {
    res.write('');
    await ImgGet()
    await crop();
    await recognize();
    const prev = await GetWeather();
    await PostImg(
`Bom dia!
prontos pra mais uma semana?
essa é a previsão do tempo para essa semana:
${prev}
E como sempre o cardapio dessa semana:
`
      ,'./img/original/img.jpg'
    )   
 res.write( `Bom dia!
prontos pra mais uma semana?
essa é a previsão do tempo para essa semana:
${prev}
E como sempre o cardapio dessa semana:
` ); 
res.end();
   });
 app.get('/almoco/'+process.env.SECRET_TOKEN,async (req, res) => {
    Post(
`${ref[0]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(0, dateFormat('',"N")-1)}
`
      )
    res.write( 
`${ref[0]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(0, dateFormat('',"N")-1)}
` ); 
        res.end();
});

app.get('/janta/'+process.env.SECRET_TOKEN,async (req, res) => {
    Post(
`${ref[1]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(1, dateFormat('',"N")-1)}
`
      )
    res.write( 
`${ref[1]} - ${days[dateFormat('',"N")-1]} ${dateFormat('', "d/mm")}\n
${GetText(1, dateFormat('',"N")-1)}
` ); 
        res.end();
});

function GetText(refN, dayN){
    var data = JSON.parse(fs.readFileSync('cardapio.json').toString())
    var tex = '';
        for(var i = 0; i<data[ref[refN]][days[dayN]].length; i++){
            tex += data[ref[refN]][days[dayN]][i]+'\n'
        } 
    return tex
  }

 server.listen(port);
