var express =  require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    mime = require('mime');

server.listen(8001);
app.get('/',function(req,res){
    var realpath = __dirname + '/client.html';
    //console.log(realpath);
    res.writeHead(200,{'Content-Type':mime.lookup(realpath)});
    res.end(fs.readFileSync(realpath));
});


var getCurrTime = function(){
    var d  = new Date();
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
};
io.sockets.on('connection', function (socket) {
  socket.on('msg', function(msg){
     var data = {username:socket.name,time:getCurrTime(),msg:msg};
     socket.emit('msg',data);
     socket.broadcast.emit('msg',data);
  });
  socket.on('login', function(username){
     socket.name = username;
     var data = {username:'SYSTEM',time:getCurrTime(),msg:'welcome '+socket.name+' in...'};
     socket.broadcast.emit('msg',data);
     socket.emit('msg',data);
  });
  socket.on('logout', function(username){
     var data = {username:'SYSTEM',time:getCurrTime(),msg:'bye, '+socket.name+' leave...'};
     socket.broadcast.emit('msg',data);
     socket.emit('msg',data);
  });
  socket.on('disconnect', function () {
        socket.send(getCurrTime()+' '+socket.name+ " out...");
  });
});