var express = require("express");
var app = express();
var httpServer = require("http").createServer(app);
var io = require("socket.io")(httpServer);
var data = require("./ontos/app").data;
var update = require("./ontos/app").update;

//console.log(data[0]);
//var t = { hr:12, mins:15 };
//update(data,t);

app.use(express.static(__dirname + "/"));

app.get("/", function(req,res) {
  res.sendFile(__dirname + "/index.js");
});

httpServer.listen(8080, function() {
  console.log("ready!");
});

//var time;

io.on("connection", function(socket) {
  console.log(socket.id);
  var time;
  var t0 = new Date().getTime();

  socket.on("time", function(t) {

    if(time != t.mins) {
      time = t.mins;
      var t1 = new Date().getTime();

      setInterval(function() { update(data,t,socket); }, 300);

//      console.log(t1-t0);
      t0 = t1;
    }
  });

});
