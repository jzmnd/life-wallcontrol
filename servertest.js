// Require HTTP module
const http = require('http');

// Define hostname and port
const hostname = '192.168.1.64';
const port = 8080;

// Function to handle request and send responses
function handleRequest(request, response){
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain');
	response.write('Hello World\n');
	response.write('Hello Jane!!!\n');
	response.end('It Works!! Path Hit: ' + request.url);
}

// Function to report to console
function reportConsole(){
	console.log("Server running at http://%s:%s/", hostname, port);
}

// Create server
const server = http.createServer(handleRequest);

//Start server
server.listen(port, hostname, reportConsole);
