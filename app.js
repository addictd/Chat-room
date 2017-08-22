var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');
var path = require('path');


app.use(require('express').static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')))

app.get('/', function(req, res){
  res.sendfile('./views/index.html');
});



var user_array=[];
var i=0;
var user=0;
io.on('connection', function(socket){
	console.log('A user connected');
	user++;
  
	socket.on('setUsername',function(data){
		  console.log(data);
		  if(user_array.indexOf(data) < 0 && data.length > 0 ){
			  user_array.push(data);
			  console.log(user_array);
			  i=1;
			  socket.emit('flag_setname',i);
			  socket.emit('connection_status',{ description: 'Welcome to chat room!'});
			  socket.broadcast.emit('connection_status',{ description: user + ' users connected!'});
		  }else if(user_array.indexOf(data) < 0 ){
			  socket.emit('changeUsername',{description:'Enter Username'});
		  }else{
			  socket.emit('changeUsername',{description:'Username already taken'});
		  }
	  });
	
	socket.on('msg',function(data){
		console.log(data.description);
		io.sockets.emit('msg_broadcast',{description:data.description,
										msgSender:data.msgSender
		});
	});
	
  socket.on('disconnect', function () {
    console.log('A user disconnected');
	user--;
	socket.broadcast.emit('connection_status',{ description: user + ' users connected!'});
  });

});

http.listen(3000, function(){
  console.log('listening on :3000');
});