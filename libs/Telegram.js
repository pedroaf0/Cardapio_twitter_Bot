var request = require("request");
require('dotenv').config();


function telegram(method, param, cb){
    var options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/${method}`,
        json: true,
        formData: param
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
       if(cb) cb(body,response)
      });


}
module.exports.SendMessage = function SendMessage(message){
  telegram('sendmessage',
    {
      "chat_id":"-1001168464133",
      "text":message,
      "parse_mode":"markdown"
    }
  )
}
module.exports.sendPhoto = function sendPhoto(link){
  telegram('sendPhoto',
    {
      "chat_id":"-1001168464133",
      "photo":link
    }
  )
}