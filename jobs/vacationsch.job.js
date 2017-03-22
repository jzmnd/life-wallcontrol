var lifx = require('../lifx.js');
var logger = require('../logger.js');
var schedule = require('node-schedule');

var timeVar = 10;
var jobs = {};

var times = {
  'timeAMon': {
    'hour': 19,
    'minute': 10,
    'state': 'on'
  },
  'timeAMoff': {
    'hour': 22,
    'minute': 45,
    'state': 'off'
  },
  'timePMon': {
    'hour': 7,
    'minute': 0,
    'state': 'on'
  },
  'timePMoff': {
    'hour': 7,
    'minute': 30,
    'state': 'off'
  },
};

// Random integer plus or minus v
function setRandomMins(time, v) {
  v = Math.floor(Math.abs(v));
  time.minute += Math.round(v * 2 * Math.random() - v);
  if (time.minute > 59) {
    if (time.hour !== 23) {
      time.hour += 1;
    }
    time.minute -= 60;
  }
  if (time.minute < 0) {
    if (time.hour !== 0) {
      time.hour -= 1;
    }
    time.minute += 60;
  }
  return time;
}

// Sets scheduled light changes
for (var t in times) {
  times[t] = setRandomMins(times[t], timeVar);
  
  times[t].command = 's';
  times[t].device = 'switchalllights';
  times[t].brightness = 1;

  jobs[t] = schedule.scheduleJob(times[t], function(data) {
    if (VACATIONMODE) {
      logger.info("Scheduled vacation mode LIFX:", data.command, ":", data.device, "is", data.state);
      lifx.lifxControl(data);
    }else {
      return;
    }
  }.bind(null, times[t]));
}
