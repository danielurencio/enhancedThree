var d3 = require("d3");
var topojson = require("topojson");
var ontos = require("./ontos");
var City = ontos.City;
var Agent = ontos.Agent;
var topology = require("../m_t.json");
var points = require("../numext.json");

var sanpedro = new City(700,500,topology,points);
var data = sanpedro.getPoints();
sanpedro.renderPoints(data);


//pace(t);
//var hr = 0, mins = 0

function Time() {
  this.mins = 0;
  this.hr = 0;
};

Time.prototype.run = function() {
  var t;
  this.mins++;
  if(this.mins == 60) { this.mins = 0; this.hr++; };
  if(this.hr == 24) { this.hr = 0; };
  t = { hr:this.hr, mins:this.mins };
//  return t;
  console.log(t);
  return t;
};

Time.prototype.pace = function(T) {
  setInterval(function() {
    sanpedro.dynamics(this.run());
//    this.run();
  }.bind(this), T);
};

module.exports = { Time:Time };
