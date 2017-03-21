var lifx = require('../lifx.js');
var logger = require('../logger.js');
var schedule = require('node-schedule');

var timeA = {
  'hour': 7,
  'minute': 0
};
var timeB = {
  'hour': 7,
  'minute': 30
};
var timeC = {
  'hour': 19,
  'minute': 45
};
var timeD = {
  'hour': 22,
  'minute': 0
};

// Random integer plus or minus v
function getRandom(v) {
  v = Math.floor(Math.abs(v));
  return Math.round(v * 2 * Math.random() - v);
};

// Toggles lights if vacation mode is set
function vacationSchedule() {
  var data = {
    'device': 'switchalllights',
    'command': 't',
  };
  lifx.lifxControl(data);
};

//var jA = schedule.scheduleJob(timeA, vacationSchedule());
//var jB = schedule.scheduleJob(timeB, vacationSchedule());
//var jC = schedule.scheduleJob(timeC, vacationSchedule());
//var jD = schedule.scheduleJob(timeD, vacationSchedule());
