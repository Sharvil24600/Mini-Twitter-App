var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


// model for mongodb
var Message = mongoose.model('Message',{
  name : String,
  message : String


})


var database = 'mongodb://127.0.0.1:27017/chat';

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})

//it will be used to post new message entered by user  into MongoDb database

app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('Tweet is saved in database');


  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})



io.on('connection', () =>{
  console.log('Yay! User is connected')
})

mongoose.connect(database ,(err) => {
  console.log('mongodb connected Sucessfully');
})

const port=3000;
var server = http.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
