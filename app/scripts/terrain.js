var renderer	= new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var onRenderFcts= [];
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.z = 10; 


	//////////////////////////////////////////////////////////////////////////////////
	//		set 3 point lighting						//
	//////////////////////////////////////////////////////////////////////////////////

	;(function(){
		// add a ambient light
		var light	= new THREE.AmbientLight( 0xf5f5cf )
		scene.add( light )
		// add a light in front
		var light	= new THREE.DirectionalLight(0xf5f5cf, 1)
		light.position.set(0.5, 0.0, 2)
		scene.add( light )
		// add a light behind
		var light	= new THREE.DirectionalLight('white', 0.75*2)
		light.position.set(-0.5, -0.5, -2)
		//scene.add( light )		
	})()

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////	

	var heightMap	= THREEx.Terrain.allocateHeightMap(128,128)
	// var heightMap	= THREEx.Terrain.allocateHeightMap(64,64)
	// var heightMap	= THREEx.Terrain.allocateHeightMap(4, 4)
	// var heightMap	= THREEx.Terrain.allocateHeightMap(16,16)
	THREEx.Terrain.simplexHeightMap(heightMap)
	
	var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap)

	THREEx.Terrain.heightMapToVertexColor(heightMap, geometry)
	
	
	var material	= new THREE.MeshPhongMaterial({
		shading		: THREE.FlatShading,
		color: 0x76a275,
        shininess: 0,
        specular: 0x3a5939
	});
	// var material	= new THREE.MeshNormalMaterial({
	// 	shading		: THREE.SmoothShading,
	// })
	var mesh	= new THREE.Mesh( geometry, material );
	scene.add( mesh );
	mesh.lookAt(new THREE.Vector3(0,1,0))
	mesh.rotateZ(-Math.PI/2)
	mesh.scale.y	= 2
	mesh.scale.x	= 2
	mesh.scale.z	= 0.2
	mesh.scale.multiplyScalar(30) 
	
	
	onRenderFcts.push(function(delta, now){
		mesh.rotation.z += 0 * delta;
		// mesh.rotation.y += 2 * delta;		
	})

	scene.fog = new THREE.Fog(0x000000,0,50);
 	var BollGeo = new THREE.SphereGeometry( 0.3, 5, 5 );

	var trees = new THREE.Object3D();

	//var cubes = new THREE.Object3D();
   	var range = 60;

   	var Box_material = new THREE.MeshPhongMaterial( {
       color: 0x66493b,
       shininess: 0,
       specular: 0x222222,
       shading: THREE.FlatShading
   	});


	$.get("php/getAllMoviesInDatabase.php",function(data){

		var array = JSON.parse(data);
		//console.log(array);
		makeDaTrees(array);	
	});

	function makeDaTrees(data){

   	for(var i = 0; i < data.length; i++ ) {
    	
    	var Box_geometry = new THREE.BoxGeometry(0.2,1,0.2); // generate psuedo-random geometry

       	var grayness = Math.random() * 0.5 + 0.25,
        mat = new THREE.MeshBasicMaterial();
       	var cube = new THREE.Mesh( Box_geometry, Box_material );
       	var boll = new THREE.Mesh( BollGeo, Box_material );

       	cube.castShadow = true;
       	boll.castShadow = true;
       	//cube.receiveShadow = true;
       	mat.color.setRGB( grayness, grayness, grayness );
       	var x =  range * (0.5 - Math.random());
       	var z = range * (0.5 - Math.random())
       	//console.log(heightMap);
       	//console.log(mesh);
       	var y = THREEx.Terrain.planeToHeightMapCoords(heightMap, mesh, x, z) + 0.4

       	cube.position.set(x,y,z);

       	boll.position.set(x,y+0.5,z);
       	//cube.grayness = grayness; // *** NOTE THIS
       	trees.add( boll );
       	trees.add( cube );
   }
   	trees.scale.multiplyScalar(1);
   	trees.castShadow = true;
   	scene.add( trees );

   }


	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
		mouse.y	= (event.clientY / window.innerHeight) - 0.5
	}, false)
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*15 - camera.position.x) * (delta*3)
		camera.position.y += (mouse.y*15 - (camera.position.y-2)) * (delta*3)
		camera.lookAt( scene.position )
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})