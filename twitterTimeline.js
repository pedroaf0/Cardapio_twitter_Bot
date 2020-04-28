require('dotenv').config();
var T = new require('twit')({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

module.exports.Post = async function Post(text){
   var params = { status: text }
   T.post('statuses/update', params, function (err, data, response) {
      if(err)console.log(err);
    })
}
module.exports.PostImg = async function PostImg(text, img){
   var b64content = require('fs').readFileSync(img, { encoding: 'base64' })

   T.post('media/upload', { media_data: b64content }, function (err, data, response) {

      var mediaIdStr = data.media_id_string
      var meta_params = { media_id: mediaIdStr, alt_text: { text: 'Cardapio.jpg' } }
     
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {

         var params = { status: text, media_ids: [mediaIdStr] }
     
          T.post('statuses/update', params, function (err, data, response) {
            if(err)console.log(err);
          })
        }
      })
    })
}