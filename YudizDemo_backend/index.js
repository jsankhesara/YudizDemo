var express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
port = process.env.PORT || 3001;
bodyParser = require('body-parser');
var server = require('http').createServer(app);

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  next();
});

app.use('/images', express.static('images'))
app.use(bodyParser.json({limit:'500mb'}));
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));

global.socketConnection = null;
// Initialize socket
const socketio = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
// Socket handler
require('./utils/socket')(socketio);

//DB Connection
require('./utils/db');
require('./routes')(app);
server.listen(port);
console.log('Live - Welcome to Yudiz Demo:- ' + port);

