function run() {

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

  queue()
    .defer(d3.json, "../../m_t.json")
    .defer(d3.json, "../../numext.json")
    .await(DO);

  function DO(err, blocks, points) {
    if(err) console.log(err);

    var sanpedro = new City(700,500,blocks,points);
    var points = sanpedro.getPoints();
    var renderedPoints = sanpedro.renderPoints(points, ps_geometry, ps_material);
    var particles = renderedPoints.geometry.vertices;

    var t0, t1;
    var time = new Time(t0,t1);
    var socket = io.connect();


    function render() {
      requestAnimationFrame( render, canvas );
      renderer.render( scene, camera );
      var T = 100;
      var t = time.timeKeep(T);
      socket.emit("time", t);
      var hour = new Display(ctx,canvas);
      hour.text(t.t,ctx);
      socket.on("agents", function(b) {
	sanpedro.receive(b);
      });

    };

    render();

  }

};

run();


