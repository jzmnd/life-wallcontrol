// Blocking example
var fs = require("fs");

var data = fs.readFileSync("token");

console.log(data.toString());
console.log("END");

// Non-blocking
function callback(err, data){
	if (err) return console.error(err);
	console.log(data.toString());
}

fs.readFile("token", callback);
console.log("END");
