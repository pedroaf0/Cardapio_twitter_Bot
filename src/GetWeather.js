const request = require('request');
const { daysBrev, ConditionToEmoji } = require('../consts');
var text = '';

module.exports.GetWeather = () => new Promise((re,err)=>{
    request('https://api.hgbrasil.com/weather?format=json-cors&key=dc818b04&woeid=461260', function (error, response, body) {
        for(var i = 0;i < 5; i++){
              text += `${daysBrev[i]}: ${ConditionToEmoji[JSON.parse(body).results.forecast[i].condition]}  `
        }
        console.log(text);
        re(text);
      });  
}) 



