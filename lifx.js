// Requires
var spawn = require('child_process').spawn;
var logger = require('./logger.js');

var ALLLIGHTSBUTTON = 'switchalllights';
var ROOTPATH = __dirname;

// LIFX control function
exports.lifxControl = function(data, callback) {
  // Spawn the .py LIFX script
  var pylifx = spawn('python', [ROOTPATH + '/lifxpyfunctions.py']);
  var allLights = {};

  // Parse data from .py script
  pylifx.stdout.on('data', function(lights) {
    allLights = JSON.parse(lights.toString());
  });

  // On completion of .py LIFX script
  pylifx.stdout.on('end', function() {
    // Check allLights is iterable
    if (!allLights.forEach) {
      return;
    }
    // All lights control
    if (data.device === ALLLIGHTSBUTTON) {
      data.state = 'on';
      allLights.forEach(function(l) {
        send_event(l.device, l);
        if (l.state === 'off') {
          data.state = 'off';
        }
      });
      send_event(data.device, data);
      if (callback && typeof(callback) === "function") {
        callback(data);
      }
    // Single light control
    }else {
      allLights.forEach(function(l) {
        if (l.device === data.device) {
          send_event(l.device, l);
          if (callback && typeof(callback) === "function") {
            callback(l);
          }
        }
      });
    };
  });

  // Send data to the .py process as a string
  pylifx.stdin.write(JSON.stringify(data));
  pylifx.stdin.end();
};
