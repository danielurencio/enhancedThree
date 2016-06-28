function City(width,height,topology,points) {
    this.points = points;
    this.width = width;
    this.height = height;
    this.data = topology;
    this.key = Object.keys(this.data.objects);
    this.projection = d3.geo.mercator().scale(1).translate([0,0]);
    this.path = d3.geo.path().projection(this.projection);
    this.b = this.path.bounds(
	topojson.feature(this.data, this.data.objects[this.key])
    );
    this.s = .95 / Math.max(
	(this.b[1][0] - this.b[0][0]) / this.width, 
	(this.b[1][1] - this.b[0][1]) / this.height
    );
    this.t = [
	(this.width - this.s * (this.b[1][0] + this.b[0][0])) / 2,
	(height - this.s * (this.b[1][1] + this.b[0][1])) / 2
    ];
    this.projection = this.projection.scale(this.s).translate(this.t);
};

function Time(t0,t1) {
  this.t0 = t0;
  this.t1 = t1;
  this.num = 0;
  this.a = 0;
  this.hr = 0;
  this.minutes = 0;
};

function Agent(name,start,finish,members) {
  this.name = name;
  this.schedule = {
    start: { hour: start.hour, mins: start.mins },
    finish: { hour:finish.hour, mins:finish.mins }
  };
  this.whereabout = 1;
  this.consuming = Math.floor(Math.random()*this.members*0.8);
  this.members = members;

};

function Display(ctx,canvas) {
  this.ctx = ctx;
  this.ctx.font = "15px Helvetica";
  this.xf = 0.75;
  this.yf = 0.34;
  this.x = canvas.width * this.xf;
  this.y = canvas.height * this.yf;
 // this.text = t;
};


City.prototype = {

	getBlocks: function() {

	    var data = this.data;
	    var projection = this.projection;
	    var path = this.path;
	    var width = this.width;
	    var height = this.height;
	    var key = this.key;
	    var container = [];
	    var blocks = topojson.feature(data, data.objects[key]).features;
	    var times = blocks.length;


	    for(var k=0; k<times; k++) {

	        var block = blocks[k];
	        var name = block.properties.CVEGEO;
	        block = path(block);

	        block = block.split("L");
	        block[0] = block[0].split("M")[1];
	        block[block.length-1] = block[block.length-1].split("Z")[0];


	        for(var i in block) {
		    block[i] = block[i].split(",");

		    for(var j in block[i]) {
		        block[i][j] = Number(block[i][j]);
		    }  
    // <!!> Shift the relative position of the vertical coordinates <!!>
		    block[i][1] = (1-(block[i][1]/height))*height;
		}

	        block = { vertices:block, name:name };
	        container.push(block);
	    } 

	    return container;

	},

	getPoints: function() {
	    var height = this.height;
	    var points = this.points.features;
	    var container = [];
	    var point;
	    var tipo = "VIVIENDA" || "VIVIENDA CON ACTIVIDAD ECONÓMICA";
	    for(var i in points) {
	     if(points[i].properties.TIPODOM  ) {
		var cvegeo = points[i].properties.CVEGEO;
		var idunico = points[i].properties.IDUNICO;
		var tipo = points[i].properties.TIPODOM; // TIPODOM..
		var personas = points[i].properties.personas;
		point = this.projection(points[i].geometry.coordinates);
		point[1] = (1-(point[1]/height))*height;
		container.push({
		    coords:point,
		    cvegeo:cvegeo,
		    idunico:idunico,
		    tipo:tipo,
		    personas:+personas
		});
	     }
	    }

	return container;
	},

	renderPoints: function(p,G,M) {

	  function members(num,id) {
	    var members =[];
	    for(var i=1;i<=num;i++) {
		var start = {
		  hour: 5+Math.floor(Math.random()*9),
		  mins: Math.floor(Math.random()*59)
		};
		var finish = {
		  hour: 12 + Math.floor(Math.random()*12),
		  mins: Math.floor(Math.random()*59)
		};

		members.push( new Agent(id,start,finish) );
	    };
	    return members;
	  };

	  for(var i in p) {
	    var particle = new THREE.Vector3(p[i].coords[0],p[i].coords[1],0);

	    var start = {
	      hour: 5 + Math.floor(Math.random()*9),
	      mins: Math.floor(Math.random()*59)
	    };
	    var finish = {
	      hour: 12 + Math.floor(Math.random()*12),
	      mins: Math.floor(Math.random()*59)
	    };

	    particle.agents = new Agent(i,start,finish,1); //members

	    G.vertices.push(particle);
	    var color = new THREE.Color().setRGB(1,1,1);
	    G.colors.push(color);
	  };

	  var particleSystem = new THREE.ParticleSystem(G,M);
	  particleSystem.sortParticles = true;
	  scene.add(particleSystem);

	  this.particles = particleSystem.geometry;
	  return particleSystem;
	},

	dynamics: function(T) {
	  var hr = T.hr, mins = T.mins;
	  var particles = this.particles.vertices;
	  var colors = this.particles.colors;

	  particles.forEach(function(a,i) {
	    a.agents.routine(hr,mins);

	    var w = a.agents.whereabout;
	    a.agents.activity(w);

	    if(a.agents.whereabout === 1) colors[i].setRGB(1,1,1);
	    if(a.agents.whereabout === 0) colors[i].setRGB(0,0,0);
	    if(a.agents.consuming > 500*1 ) colors[i].setRGB(1,0.2,0);
	  });

	}

};


Time.prototype.timeKeep = function() {
  this.t1 = new Date().getTime();
  this.num = this.t1 - this.t0;

  if(this.mum<100) this.a += this.num;
  if(this.a>=1) this.a=0; this.minutes++;
  if(this.minutes==60) { this.minutes = 0; this.hr++; };
  if(this.hr==25) { this.hr=1 };
  this.t0 = this.t1;
  var t = "Hora: " + this.hr + ":" + this.minutes;
  return { hr:this.hr, mins:this.minutes, t:t };
};


Agent.prototype = {
  routine: function(hr,mins) {
    if( hr==this.schedule.start.hour && mins==this.schedule.start.mins ) {
      this.whereabout = 0;
    };
    if( hr==this.schedule.finish.hour && mins==this.schedule.finish.mins) {
      this.whereabout = 1;
    }
  },

  activity: function(w,hr) {
    if(w==1) this.consuming = Math.floor(Math.random()*this.members*800);
    if(w==0) this.consuming = 0;
  }
};

Display.prototype.text = function(text,ctx) {
  this.text = text;
  var textW = this.ctx.measureText(this.text).width;
  var textH = parseInt(this.ctx.font);
//  console.log(textH);
  this.ctx.clearRect(this.x,this.y-textH,textW+10, textH);
  this.ctx.fillStyle = "rgba(255,255,255,.25)";
  this.ctx.fillText(this.text, this.x, this.y)
};
