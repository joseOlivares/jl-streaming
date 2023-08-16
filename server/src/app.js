const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

/*
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
*/


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

