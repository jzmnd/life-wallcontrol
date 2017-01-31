// dashingserver.js
// Jeremy Smith
// Modified and updated from dashing-js by Fabio Caseri

// Globals
global.SCHEDULER = require('node-schedule');
global.ROOTPATH = __dirname;
global.HISTORY = {};
global.CONNECTIONS = {};

// Requires
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mincer = require('mincer');
var logger = require('./logger.js');
var lifx = require('./lifx.js');

module.exports.Dashing = Dashing;
module.exports.logger = logger;
module.exports.lifx = lifx;


// Dashing class constructor
function Dashing() {  
  // Mincer environment setup
  var env = new mincer.Environment()
  env.appendPath(['assets', 'javascripts'].join(path.sep));
  env.appendPath(['assets', 'stylesheets'].join(path.sep));
  env.appendPath(['assets', 'fonts'].join(path.sep));
  env.appendPath(['assets', 'images'].join(path.sep));
  env.appendPath('widgets');
  env.appendPath('javascripts');

  var mcr = {
    assets_prefix: '/assets',
    environment: env,
  };

  // Define dashing constants
  this.dashing = {
    root: ROOTPATH,
    port: process.env.PORT || 8080,
    view_engine: process.env.VIEW_ENGINE || 'pug',
    public_folder: ROOTPATH + '/public',
    dashboard_folder: ROOTPATH + '/dashboards',
    job_path: process.env.JOB_PATH || (ROOTPATH + '/jobs'),
    default_dashboard: 'dashboard',
    assetjs: mcr.environment.findAsset('application.js'),
    assetcss: mcr.environment.findAsset('application.css'),
    mcr: mcr
  };
};


// Start server function
Dashing.prototype.start = function() {
  // Build the express app
  var app = express();
  // Localize this.dashing
  var self = this.dashing;
  // Load utility functions
  require('./utils.js');

  // Mincer middleware
  app.use(self.mcr.assets_prefix, mincer.createServer(self.mcr.environment));

  // Static folder and express variables
  app.use(express.static(self.public_folder));
  app.set('view engine', self.view_engine);
  app.set('views', self.dashboard_folder);
  app.set('port', self.port);

  // Logging middleware
  app.use(logger.logExpress);

  // Body parser middleware for POST
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // Routing homepage to default
  app.get('/', function(request, response, next) {
    if (self.default_dashboard) {
      response.redirect(self.default_dashboard);
    }else {
      next();
    };
  });

  // Info page
  app.get('/info', function(request, response, next) {
    response.write("Dashing Server");
    response.write("\nURL  : " + request.url);
    response.write("\nRoot : " + JSON.stringify(self.root));
    response.write("\nPort : " + JSON.stringify(self.port));
    response.write("\nView : " + JSON.stringify(self.view_engine));
    response.write("\nJS   : " + JSON.stringify(self.assetjs.pathname));
    response.write("\nCSS  : " + JSON.stringify(self.assetcss.pathname));
    response.end();
  });

  // GET events
  app.get('/events', function(request, response) {
    // Let request last as long as possible
    request.socket.setTimeout(0);

    var con = {
      id: (new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString()),
      send: function(body) {
        response.write(body);
        response.flushHeaders();
      }
    };
    CONNECTIONS[con.id] = con;

    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    response.write('\n');
    response.write(Array(2049).join(' ') + '\n'); // 2 kB padding
    response.write(latest_events());

    // Delete connection once event stream is closed
    request.on('close', function(){
      delete CONNECTIONS[con.id];
    });
  });

  // GET dashboard
  app.get('/:dashboard', function(request, response, next) {
    var dashboard = request.params.dashboard;
    var dashboardPath = [self.dashboard_folder, dashboard + '.' + self.view_engine].join(path.sep);
    fs.stat(dashboardPath, function(err, stats){
      if (err == null) {
        response.render(dashboard, {
          'dashboard': dashboard,
          'request': request
        });
      }else {
        next();
      };
    });
  });

  // GET widget
  app.get('/views/:widget?.html', function(request, response) {
    var widget = request.params.widget;
    response.sendFile([self.root, 'widgets', widget, widget + '.html'].join(path.sep));
  });

  // GET and POST switch state
  app.get('/switch/:device', function(request, response) {
    var data = {
      'device': request.params.device,
      'command': 'q',
    };
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    lifx.lifxControl(data, function(light) {
      logger.info('State queried and data received from LIFX:', data.device);
      response.end(JSON.stringify(light));
    });
  });

  app.post('/switch/:device/', function(request, response) {
    var data = request.body;
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    lifx.lifxControl(data, function(light) {
      logger.info('Button pressed and data received from LIFX:', data.device);
      response.end(JSON.stringify(light));
    });
  });

  // 404 page
  app.use(function(request, response) {
    response.status(404).sendFile([self.public_folder, '404.html'].join(path.sep));
  });

  // Error handler
  app.use(function(err, request, response, next) {
    logger.error(err.stack);
    response.status(500).send(err);
  });

  // Load job files
  fs.readdir(self.job_path, function(err, files) {
    for (var i in files) {
      var file = [self.job_path, files[i]].join(path.sep);
      if (file.match(/(\w*)\.job\.(js|coffee)$/)) {
        logger.info("Loading job file: %s", files[i]);
        require(file);
      };
    };
  });

  // Listen
  app.listen(self.port, function() {
    logger.info("Location: %s", self.root);
    logger.info("View Engine: %s", self.view_engine);
    logger.info("Server running at localhost:%s, CTRL+C to stop", self.port);
    logger.info("Application.js: %s B", self.assetjs.length);
    logger.info("Application.css: %s B", self.assetcss.length);
  });
};
