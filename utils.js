// Event functions
send_event = function(id, body) {
  body.id = id;
  body.updatedAt = Date.now();
  var event = 'data: ' + JSON.stringify(body) + '\n\n';
  //console.log(event);
    HISTORY[id] = event;
  for (var i in CONNECTIONS) {
    CONNECTIONS[i].send(event);
  };
};

latest_events = function() {
  var str = [];
  for (var id in HISTORY) {
    str.push(HISTORY[id]);
  }
  return str.join('');
};
