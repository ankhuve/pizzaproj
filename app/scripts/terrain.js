// var renderer	= new THREE.WebGLRenderer({
// 		antialias	: true
// 	});

// 	//renderer.shadowMap.enabled = true;
// 	//renderer.shadowMapSoft = false;

// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	document.body.appendChild( renderer.domElement );
// 	var updateFcts	= [];
// 	var onRenderFcts= [];
// 	var scene	= new THREE.Scene();
// 	var camera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
// 	camera.position.y = 0.3;
// 	camera.position.z = 2;


// 	//////////////////////////////////////////////////////////////////////////////////
// 	//		set 3 point lighting						//
// 	//////////////////////////////////////////////////////////////////////////////////

// 	;(function(){
// 		// add a ambient light
// 		var light	= new THREE.AmbientLight( 0xf5f5cf )
// 		light.castShadow = true;
// 		scene.add( light )
// 		// add a light in front
// 		var light	= new THREE.DirectionalLight(0xf5f5cf, 1)
// 		light.position.set(0.5, 0.0, 2)
// 		light.castShadow = true;
// 		scene.add( light )
// 		// add a light behind
// 		var light	= new THREE.DirectionalLight(0xa6a6a6, 0.75*2)
// 		light.castShadow = true;
// 		//light.position.set(-0.5, -0.5, -2)
// 		//scene.add( light )		
// 	})()

	

// 	//////////////////////////////////////////////////////////////////////////////////
// 	//		add an object and make it move					//
// 	//////////////////////////////////////////////////////////////////////////////////	

// 	var heightMap	= THREEx.Terrain.allocateHeightMap(128,128)
// 	// var heightMap	= THREEx.Terrain.allocateHeightMap(64,64)
// 	// var heightMap	= THREEx.Terrain.allocateHeightMap(4, 4)
// 	// var heightMap	= THREEx.Terrain.allocateHeightMap(16,16)
// 	THREEx.Terrain.simplexHeightMap(heightMap)
	
// 	var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap)

// 	THREEx.Terrain.heightMapToVertexColor(heightMap, geometry);
	
// 	var material	= new THREE.MeshPhongMaterial({
// 		shading		: THREE.FlatShading,
// 		color: 0x176fd4,
//         shininess: 0,
//         specular: 0x3a5939
// 	});
// 	// var material	= new THREE.MeshNormalMaterial({
// 	// 	shading		: THREE.SmoothShading,
// 	// })

// 	var mesh = new THREE.Mesh( geometry, material );
// 	mesh.receiveShadow = true;
// 	scene.add( mesh );
// 	mesh.lookAt(new THREE.Vector3(0,1,0))
// 	mesh.rotateZ(-Math.PI/2)
// 	mesh.scale.y	= 2
// 	mesh.scale.x	= 2
// 	mesh.scale.z	= 0.2
// 	mesh.scale.multiplyScalar(30) 
	
	
// 	onRenderFcts.push(function(delta, now){
// 		mesh.rotation.z += 0 * delta;
// 		// mesh.rotation.y += 2 * delta;		
// 	})

// 	//scene.fog = new THREE.Fog(0x000000,0,50);


// 	    var pointLight = new THREE.PointLight( 0xffffff, 1, 10 );
//         pointLight.position.set( 0, 5, 0 );
//         pointLight.castShadow = true;
//         pointLight.shadowCameraNear = 8;
//         pointLight.shadowCameraFar = 300;
//         pointLight.shadowDarkness = 0.5;
//         pointLight.shadowCameraVisible = false;
//         pointLight.shadowMapWidth = 1024;
//         pointLight.shadowMapHeight = 1024;
//         scene.add( pointLight );


// 	       //  /*Ground*/
//         // var Ground_geometry = new THREE.BoxGeometry( 40, 0.1, 40 );
//         // var Ground_material = new THREE.MeshPhongMaterial( {
//         //     color: 0xffffff,
//         //     shininess: 0,
//         //     specular: 0xffffff,
//         //     shading: THREE.SmoothShading
//         // } );

//         // var ground = new THREE.Mesh( Ground_geometry, Ground_material );
//         // ground.scale.multiplyScalar( 1 );
//         // ground.castShadow = false;
//         // ground.receiveShadow = true;
//         // scene.add( ground );

// 	var trees = new THREE.Object3D();

// 	//var cubes = new THREE.Object3D();
//    	var range = 60;

//    	var Box_material = new THREE.MeshPhongMaterial( {
//        color: 0x66493b,
//        shininess: 0,
//        specular: 0x222222,
//        shading: THREE.FlatShading
//    	});

//    	var Boll_material = new THREE.MeshPhongMaterial( {
//        color: 0x4aa24b,
//        shininess: 0,
//        specular: 0x222222,
//        shading: THREE.FlatShading
//    	});


//    	var verticesOfCube = [
//     -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
//     -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
// 	];

// 	var indicesOfFaces = [
//     2,1,0,    0,3,2,
//     0,4,7,    7,3,0,
//     0,1,5,    5,4,0,
//     1,2,6,    6,5,1,
//     2,3,7,    7,6,2,
//     4,5,6,    6,7,4
// 	];

// 	var polyGeo = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 0.3, 1 );


// 	$.get("php/getAllMoviesInDatabase.php",function(data){

// 		var array = JSON.parse(data);
// 		//console.log(array);
// 		makeDaTrees(array);	
// 	});



// 	function makeDaTrees(data){

//    	for(var i = 0; i < data.length; i++ ) {

//     	var Box_geometry = new THREE.BoxGeometry(0.1,1,0.1); // generate psuedo-random geometry
//     	var BollGeo = new THREE.SphereGeometry( 0.3, 5, 5 );

//        	var grayness = Math.random() * 0.5 + 0.25,
//         mat = new THREE.MeshBasicMaterial();
//        	var cube = new THREE.Mesh( Box_geometry, Box_material );
//        	var boll = new THREE.Mesh( polyGeo, Boll_material );

//        	cube.castShadow = true;
//        	boll.castShadow = true;
//        	//cube.receiveShadow = true;
//        	mat.color.setRGB( grayness, grayness, grayness );
//        	var x =  range * (0.5 - Math.random());
//        	var z = range * (0.5 - Math.random())
//        	//console.log(heightMap);
//        	//console.log(mesh);
//        	var y = THREEx.Terrain.planeToHeightMapCoords(heightMap, mesh, x, z) + 0.4
//        	//y = 0;
//        	cube.rotateY(-Math.PI/1.5)
//        	cube.position.set(x,y,z);
//        	boll.position.set(x,y+0.5,z);
//        	//cube.grayness = grayness; // *** NOTE THIS
//        	trees.add( boll );
//        	trees.add( cube );

//        	if(i%10==0) {

//        		var light = new THREE.PointLight( 0xffffff, 1, 10 );
// 			light.position.set( x, y+1, z );
// 			//scene.add( light );
// 		}
//    }
//    	trees.scale.multiplyScalar(1);
//    	trees.castShadow = true;
//    	scene.add( trees );

//    }


// 	//////////////////////////////////////////////////////////////////////////////////
// 	//		Camera Controls							//
// 	//////////////////////////////////////////////////////////////////////////////////
// 	// var mouse	= {x : 0, y : 0}
// 	// document.addEventListener('mousemove', function(event){
// 	// 	//mouse.x	= (event.clientX / window.innerWidth ) - 0.5
// 	// 	//mouse.y	= (event.clientY / window.innerHeight) - 0.5
// 	// }, false)
// 	// onRenderFcts.push(function(delta, now){
// 	// 	camera.position.x += (mouse.x*15 - camera.position.x) * (delta*3)
// 	// 	camera.position.y += (mouse.y*15 - (camera.position.y-2)) * (delta*3)
// 	// 	//camera.lookAt( scene.position )
// 	// })


// 		var player	= new THREEx.MinecraftPlayer()
// 	scene.add(player.character.root)
// 	updateFcts.push(function(delta, now){
// 		player.update(delta, now)
// 	})
	
// 	updateFcts.push(function(delta, now){
// 		var position	= player.character.root.position
// 		position.y	= THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, position.x, position.z)
// 	})
	
	
// 	// attach camera to player
// 	player.character.root.add(camera)
// 	camera.position.z	= -2
// 	camera.position.y	= 1
// 	camera.lookAt(new THREE.Vector3(0,0.5,2))


// 	document.body.addEventListener('keydown', function(event){
// 		var input	= player.controls.input
// 		if( event.keyCode === 'W'.charCodeAt(0) )	input.up	= true
// 		if( event.keyCode === 'S'.charCodeAt(0) )	input.down	= true
// 		if( event.keyCode === 'A'.charCodeAt(0) )	input.left	= true
// 		if( event.keyCode === 'D'.charCodeAt(0) )	input.right	= true
// 	})

// 	document.body.addEventListener('keyup', function(event){
// 		var input	= player.controls.input
// 		if( event.keyCode === 'W'.charCodeAt(0) )	input.up	= false
// 		if( event.keyCode === 'S'.charCodeAt(0) )	input.down	= false
// 		if( event.keyCode === 'A'.charCodeAt(0) )	input.left	= false
// 		if( event.keyCode === 'D'.charCodeAt(0) )	input.right	= false
// 	})


// 	//////////////////////////////////////////////////////////////////////////////////
// 	//		render the scene						//
// 	//////////////////////////////////////////////////////////////////////////////////
// 	updateFcts.push(function(){
// 		renderer.render( scene, camera );		
// 	})
	
// 	//////////////////////////////////////////////////////////////////////////////////
// 	//		loop runner							//
// 	//////////////////////////////////////////////////////////////////////////////////
// 	var lastTimeMsec= null
// 	requestAnimationFrame(function animate(nowMsec){
// 		// keep looping
// 		requestAnimationFrame( animate );
// 		// measure time
// 		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
// 		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
// 		lastTimeMsec	= nowMsec
// 		// call each update function
// 		onRenderFcts.forEach(function(onRenderFct){
// 			onRenderFct(deltaMsec/1000, nowMsec/1000)
// 		})
// 	})