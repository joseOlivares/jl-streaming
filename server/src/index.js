//const http=require('./app');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const PORT=process.env.PORT || 3200;


io.on('connection',(socket)=>{
    console.log("emitiendo");
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
        console.log(`Server is running, App is listening on port ${PORT}`);    
    } else{
        console.log(`Error occurred, server can't start`, error);
    }
    
});

