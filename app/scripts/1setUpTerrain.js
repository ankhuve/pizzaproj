var renderer = new THREE.WebGLRenderer({ antialias : true });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene	= new THREE.Scene();

renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = false;

// var backAudio = new Audio("background.mp3");
// backAudio.play();
// backAudio.volume = 0.05;


//////////////////////////////////////////////////////////////////////////////////
//		set 3 point lighting						//
//////////////////////////////////////////////////////////////////////////////////

(function(){
    // add a ambient light
    var light	= new THREE.AmbientLight( 'white' );
    scene.add( light );
    // add a light in front
    var light	= new THREE.DirectionalLight('white', 5);
    light.position.set(0.5, 0.0, 2);
    scene.add( light );
    // add a light behind
    var light	= new THREE.DirectionalLight('white', 0.75*2);
    light.position.set(-0.5, -0.5, -2);
    scene.add( light )
})();

//////////////////////////////////////////////////////////////////////////////////
//		add an object and make it move					//
//////////////////////////////////////////////////////////////////////////////////

//var heightMap	= THREEx.Terrain.allocateHeightMap(4, 4)
//var heightMap	= THREEx.Terrain.allocateHeightMap(16, 16)
//var heightMap	= THREEx.Terrain.allocateHeightMap(256,256)
var heightMap	= THREEx.Terrain.allocateHeightMap(128,128);
THREEx.Terrain.simplexHeightMap(heightMap);

var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap);
THREEx.Terrain.heightMapToVertexColor(heightMap, geometry);


var material	= new THREE.MeshPhongMaterial({
    shading		: THREE.FlatShading,
    shininess: 0,
    // shading		: THREE.SmoothShading,
    color: 0x176fd4,
    //vertexColors 	: THREE.VertexColors,
});
var ground	= new THREE.Mesh( geometry, material );
scene.add( ground );
ground.rotateX(-Math.PI/2);
ground.scale.x	= 20*10;
ground.scale.y	= 20*10;
ground.scale.z	= 1*10;
// ground.scale.multiplyScalar(10)


scene.fog = new THREE.Fog(0x000000,0,50);