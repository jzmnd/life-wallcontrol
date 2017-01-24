var lifx = require('../lifx.js');
var logger = require('../logger.js');

function updateLights() {
  var data = {
    'device': 'switchalllights',
    'command': 'q',
    };
  lifx.lifxControl(data, function(light) {
    logger.info('Update LIFX status:', data.device);
  });
};

setInterval(updateLights, 60 * 1000);
updateLights();
