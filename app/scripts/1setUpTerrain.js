var renderer = new THREE.WebGLRenderer({ antialias : true });



renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var ground, heightMap;

// main scene
var scene	= new THREE.Scene();

// second scene for minimap, this scene contains everything from scene except the terrain
var sceneMiniMap   = new THREE.Scene();



var backAudio = new Audio("sounds/background.mp3");
backAudio.loop = true;
backAudio.play();
backAudio.volume = 0.05;

createSkyAndTerrainAndAddToScene();
createAndAddLightsToScene();


function createAndAddLightsToScene(){
    //////////////////////////////////////////////////////////////////////////////////
    //		                        set 3 point lighting					    	//
    //////////////////////////////////////////////////////////////////////////////////

    // add a ambient light
    var light	= new THREE.AmbientLight( 'white', 0.2 );
    scene.add( light );
    sceneMiniMap.add( light.clone() );

    // add a light in front
    //var light	= new THREE.DirectionalLight('white', 5);
    //light.position.set(0.5, 0.0, 2);
    //scene.add( light );

    // add a light behind
    var dirLight	= new THREE.SpotLight( 0xffffff );
    dirLight.position.set(30, 30, 0);
    dirLight.angle = Math.PI / 5;
    dirLight.penumbra = 0.3;
    dirLight.shadow.camera.visible = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.left = - 15;
    dirLight.shadow.camera.top	= 15;
    dirLight.shadow.camera.bottom = - 15;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add( dirLight );

    var dirLightHelper = new THREE.SpotLightHelper(dirLight, 5);
    scene.add( dirLightHelper );



    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.2 );
    //hemiLight.color.
    // setHSL( 0.6, 1, 0.6 );
    //hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 64, 64, 0 );
    //hemiLight.instanceSkin = true;
    //hemiLight.castShadow = true;


    //scene.add( hemiLight );
    //var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 5);
    //scene.add( hemiLightHelper );
}

function createSkyAndTerrainAndAddToScene(){
    // skybox
    var skyBoxGeometry = new THREE.SphereGeometry(9500, 60, 40);

    var skyBoxMaterial = new THREE.MeshPhongMaterial({
        color: 0x69d0f9
    });

    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    skyBox.scale.set(-1, 1, 1);

    scene.add(skyBox);
    sceneMiniMap.add( skyBox );

    // creating ground
    heightMap	= THREEx.Terrain.allocateHeightMap(64, 64);
    THREEx.Terrain.simplexHeightMap(heightMap);

    var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap);
    THREEx.Terrain.heightMapToVertexColor(heightMap, geometry);

    var material	= new THREE.MeshPhongMaterial({
        shading		: THREE.FlatShading,
        shininess: 0,
        vertexColors 	: THREE.VertexColors
    });

    ground	= new THREE.Mesh( geometry, material );

    ground.rotateX(-Math.PI/2);
    ground.scale.x	= 10;
    ground.scale.y	= 10;
    ground.scale.z	= 1;
    ground.scale.multiplyScalar(20);
    ground.name = "ground";
    ground.castShadow = true;
    ground.receiveShadow = true;
    //ground.updateMatrix();

    //scene.fog = new THREE.Fog(0x69d0f9, 0, 100);

    scene.add( ground );
}


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