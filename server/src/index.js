//const http=require('./app');
const express = require("express");
const https= require("https");

const {createServer} = require("http");

const cors=require('cors');


/*** FOR HTTPS */
const fs =require('fs') ;
const options={
    pfx: fs.readFileSync(__dirname +'/cert/jlstreamapp.pfx'),
    passphrase: 'jlstreamPWD'
}
/**  */

const { Server } = require("socket.io");

const app = express();
app.use(cors()); //using cors

const httpServer = createServer(app); //for http
const httpsServer=https.createServer(options,app); //for Https

const io = new Server(httpServer, { /* options */ });

const io2=new Server(httpsServer, { /* options */ });

const PORT=process.env.PORT || 3200;
const PORT_HTTPS=3400;


io.on('connection',(socket)=>{
    console.log("Socket http: "+socket.id);
        socket.on('stream',(imgStream)=>{
            console.log("Entra en socketon stream");
            socket.broadcast.emit('stream',imgStream);
        });
});

io2.on('connection',(socket)=>{
    console.log("Socket https: "+socket.id);
        socket.on('stream',(imgStream)=>{
            console.log("Entra en socketon stream");
            socket.broadcast.emit('stream',imgStream);
        });
});

//routes
app.use(require('./routes/streaming.route.js'));
//static files
app.use(express.static(__dirname + "/public"));


httpServer.listen(PORT,(error)=>{

    if(!error){
        console.log(`Server http is running, App is listening on port ${PORT}`);    
    } else{
        console.log(`Error occurred, server can't start`, error);
    }
    
});

httpsServer.listen(PORT_HTTPS,(error)=>{

    if(!error){
        console.log(`Server https is running, App is listening on port ${PORT_HTTPS}`);    
    } else{
        console.log(`Error occurred, server can't start`, error);
    }
    
});
