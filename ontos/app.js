var d3 = require("d3");
var topojson = require("topojson");
var ontos = require("./ontos");
var City = ontos.City;
var Agent = ontos.Agent;
var topology = require("../m_t.json");
var points = require("../numext.json");

var sanpedro = new City(700,500,topology,points);
var data = sanpedro.getPoints();
data = sanpedro.renderPoints(data);

function update(data,t) {
  var start = new Date().getTime();

  data.forEach(function(a,i) {
    var inHouse = a.inHouse;
    a.agents.forEach(function(m) {
      var startHourCondition = m.schedule.start.hour == t.hr;
      var startMinsCondition = m.schedule.start.mins == t.mins;
      var finishHourCondition = m.schedule.finish.hour == t.hr;
      var finishMinsCondition = m.schedule.finish.mins == t.mins;

      if(startHourCondition && startMinsCondition) {
	m.whereabout = 0;
      };

      if(finishHourCondition && finishMinsCondition) {
	m.whereabout = 1;
      };

    });

    a.inHouse = a.agents.map(function(m) { return m.whereabout; })
      .reduce(function sum(a,b) { return a + b; }, 0);

  });
  var finish = new Date().getTime();
  console.log(finish-start);
};

update(data,{ hr:12, mins:15 });

module.exports = { data:data, update:update };
