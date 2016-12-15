// Blocking example
var fs = require("fs");

var data = fs.readFileSync("file");

console.log(data.toString());
console.log("END");

// Non-blocking
function callback(err, data){
	if (err) return console.error(err);
	console.log(data.toString());
}

fs.readFile("file", callback);
console.log("END");
