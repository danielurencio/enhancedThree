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
    var hour = new Display(ctx,canvas);
    var worker = new Worker("public/js/worker.js");

    function render() {
      requestAnimationFrame( render, canvas );
      renderer.render( scene, camera );
      var t = time.timeKeep();

      var hour = new Display(ctx,canvas);
      hour.text(t.t,ctx);

      sanpedro.dynamics(t);
      worker.postMessage(t);

      worker.onmessage = function(e) {
//	console.log(e.data.r);
      };


    };

    render();
  }

};

run();


