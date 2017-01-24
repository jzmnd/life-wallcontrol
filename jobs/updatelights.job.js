var lifx = require('../lifx.js');
var logger = require('../logger.js');

function updateLights() {
  var data = {
    'device': 'switchalllights',
    'command': 'q',
    };
  lifx.lifxControl(data);
};

setInterval(updateLights, 60 * 1000);
updateLights();
