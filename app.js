var http = require('http')
  , fs = require('fs')
  , bee = require("beeline");
  

function handler (req, res) {
  fs.readFile(__dirname + '/terminal.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var router = bee.route({ // Create a new router
    "/static/`path...`":
        bee.staticDir("./static/", {".txt": "text/plain",".js": "text/javascript", ".html": "text/html",".css": "text/css", ".xml": "text/xml"}), "/`user`/static/`path...`": function(req, res, tokens, values) {
    },
	"/": handler
});

var app = http.createServer(router);
var io = require('socket.io').listen(app);


var spawn = require('child_process').spawn;
//var ssh = spawn('sh');



io.sockets.on('connection', function (socket) {
  var ssh = spawn('sshpass', ['-p', 'onClipEvent', 'ssh', '-tt', 'amir@localhost']);
  ssh.on('exit', function (data) {
    console.error("EX");
  });
	socket.on('stdin', function (data) {
		console.log("-" + data.data + "-");
		ssh.stdin.write(data.data.toString());
	});
	ssh.stdout.on('data', function (data) {
		console.log("@@" + data);
		socket.emit('stdout', { data: data.toString() });
	});
	ssh.stderr.on('data', function (data) {
    console.log("%%" + data);
		socket.emit('stdout', { data: data.toString() });
	});
});

app.listen(3000);