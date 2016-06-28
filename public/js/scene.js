var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );

var renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor("rgb(0,0,0)",0);
document.body.appendChild( renderer.domElement );

camera.position.set(350,250,300);

var ps_geometry = new THREE.Geometry();
var ps_material = new THREE.ParticleBasicMaterial({
  size:1,
  sizeAttenuation:false,
  vertexColors:true,
  color:"white"
});
