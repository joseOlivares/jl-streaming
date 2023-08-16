const express =require('express');
const app= express();


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//routes
app.use(require('./routes/streaming.route.js'));
//static files
app.use(express.static(__dirname + "/public"));


io.on('connection',(socket)=>{
    console.log("emitiendo");
        socket.on('stream',(imgStream)=>{
            console.log(imgStream);
            socket.broadcast.emit('stream',imgStream);
        });
});




module.exports=app;

