/**
 * test ob data server (ds) verfügbar
 * stackoverflow.com/questions/29860354/in-nodejs-how-do-i-check-if-a-port-is-listening-or-in-use
 */
var net = require('net');

var available = function(port, host, cb) {
    var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
    });

    server.listen(port, host);
    server.on('error', function (e) {
	cb(true);
    });
    server.on('listening', function (e) {
	server.close();
	cb(false);
    });
};
exports.available = available;
