var renderer = new THREE.WebGLRenderer({ antialias : true });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene	= new THREE.Scene();



// second scene for minimap, this scene contains everything from scene except the terrain
var sceneMiniMap   = new THREE.Scene();

renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = false;

var backAudio = new Audio("sounds/background.mp3");
backAudio.loop = true;
backAudio.play();
backAudio.volume = 0.05;


//////////////////////////////////////////////////////////////////////////////////
//		set 3 point lighting						//
//////////////////////////////////////////////////////////////////////////////////

(function(){
    // add a ambient light
    var light	= new THREE.AmbientLight( 'white' );
    scene.add( light );
    sceneMiniMap.add( light.clone() );

    // add a light in front
    var light	= new THREE.DirectionalLight('white', 5);
    light.position.set(0.5, 0.0, 2);
    //scene.add( light );
    // add a light behind
    var light	= new THREE.DirectionalLight('white', 0.75*2);
    light.position.set(-0.5, -0.5, -2);


    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.1 );
    //hemiLight.color.setHSL( 0.6, 1, 0.6 );
    //hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 500, -500, 0 );
    //scene.add( hemiLight );
    //scene.add( light )
})();

// skybox
var geometry = new THREE.SphereGeometry(9500, 60, 40);  

var material = new THREE.MeshPhongMaterial({
    color: 0x69d0f9
});

skyBox = new THREE.Mesh(geometry, material);  
skyBox.scale.set(-1, 1, 1);  


scene.add(skyBox);
sceneMiniMap.add( skyBox );  

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
    //color: 0x176fd4,
    vertexColors 	: THREE.VertexColors
});

var ground	= new THREE.Mesh( geometry, material );

ground.rotateX(-Math.PI/2);
ground.scale.x	= 20;
ground.scale.y	= 20;
ground.scale.z	= 1;
ground.scale.multiplyScalar(6.45);

scene.fog = new THREE.Fog(0x69d0f9,0,80);

// create clouds

// var verticesOfCube = [
//     -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
//     -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1
// ];

// var indicesOfFaces = [
//     2,1,0,    0,3,2,
//     0,4,7,    7,3,0,
//     0,1,5,    5,4,0,
//     1,2,6,    6,5,1,
//     2,3,7,    7,6,2,
//     4,5,6,    6,7,4
// ];

// var cloudMat = new THREE.MeshPhongMaterial( {
//     color: new THREE.Color("rgb(255,255,255)"),
//     shininess: 0,
//     specular: 0x222222,
//     shading: THREE.FlatShading
// });

// var cloudGeo = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 4, 1 );
// var cloudGeoL = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 3, 1 );
// var cloudGeoR = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 3, 1 );

// var cloudObj = new THREE.Object3D();

// function createClouds() {

//     var x = 50 * (0.5 - Math.random());
//     var z = 50 * (0.5 - Math.random());
//     var y = THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, x, z);

//     var cloud = new THREE.Mesh( cloudGeo, cloudMat );
//     var cloudL = new THREE.Mesh( cloudGeoL, cloudMat );
//     var cloudR = new THREE.Mesh( cloudGeoR, cloudMat );

//     cloud.position.set(x,y+30,z);
//     cloudL.position.set(x-4,y+28,z);
//     cloudR.position.set(x+4,y+28,z);

//     cloudObj.add(cloud, cloudL, cloudR);

//     scene.add(cloudObj);
//     console.log(cloudObj);

// }

// createClouds();