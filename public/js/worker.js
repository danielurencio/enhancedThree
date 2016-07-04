this.onmessage = function(e) {
//    console.log(e.data);
    var t0 = new Date().getTime();
    var rule = Object.keys(e.data).length;

    if(rule < 3) { console.log("!");
console.log(e.data);
      this.data = JSON.parse(e.data.data);
      this.postMessage("e");
    };

    if( rule == 3 ) {
      var t = e.data;
      var start = new Date().getTime();
      this.data.forEach(function(a,i) {

       a.agents.forEach(function(m) {

    if(+m.schedule.start.hour == +t.hr && +m.schedule.start.mins == +t.mins) {
	  m.whereabout = 0; //console.log(m.schedule.start, t.t);
	  a.inHouse = a.agents.map(function(m) { return m.whereabout; })
	    .reduce(function sum(a,b) { return a + b; },0);
	};
    if(+m.schedule.finish.hour == t.hr && +m.schedule.finish.mins == t.mins) {
	  m.whereabout = 1;
	  a.inHouse = a.agents.map(function(m) { return m.whereabout; })
	    .reduce(function sum(a,b) { return a + b; },0);
	};

      });

//	a.inHouse = a.agents.map(function(m) { return m.whereabout; })
//	  .reduce(function sum(a,b) { return a + b },0);
var aaaa = a.inHouse; //if(aaaa!=5) 

//	this.postMessage({r:aaaa,n:i});
	
      });

//    var count = this.data.map(function(d) { return d.inHouse; })
//	.reduce(function sum(a,b) { return a + b; });
//var aa = new Date().getTime() - start;

//	this.postMessage({t:"aa"});
//	console.log(new Date().getTime() - start);
    }

};
