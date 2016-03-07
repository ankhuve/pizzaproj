
	var renderer	= new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var updateFcts	= [];
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 200 );
	camera.position.y = 0.3;
	camera.position.z = 2;

	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = false;


	//////////////////////////////////////////////////////////////////////////////////
	//		set 3 point lighting						//
	//////////////////////////////////////////////////////////////////////////////////

	;(function(){
		// add a ambient light
		var light	= new THREE.AmbientLight( 'white' )
		scene.add( light )
		// add a light in front
		var light	= new THREE.DirectionalLight('white', 5)
		light.position.set(0.5, 0.0, 2)
		scene.add( light )
		// add a light behind
		var light	= new THREE.DirectionalLight('white', 0.75*2)
		light.position.set(-0.5, -0.5, -2)
		scene.add( light )		
	})()

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////	

	//var heightMap	= THREEx.Terrain.allocateHeightMap(4, 4)
	//var heightMap	= THREEx.Terrain.allocateHeightMap(16, 16)
	//var heightMap	= THREEx.Terrain.allocateHeightMap(256,256)
	var heightMap	= THREEx.Terrain.allocateHeightMap(128,128)
	THREEx.Terrain.simplexHeightMap(heightMap)
	
	var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap)
	THREEx.Terrain.heightMapToVertexColor(heightMap, geometry)
	
	
	var material	= new THREE.MeshPhongMaterial({
		shading		: THREE.FlatShading,
		shininess: 0,
		// shading		: THREE.SmoothShading,
		color: 0x176fd4,
		//vertexColors 	: THREE.VertexColors,
	});
	var ground	= new THREE.Mesh( geometry, material );
	scene.add( ground );
	ground.rotateX(-Math.PI/2)
	ground.scale.x	= 20*10
	ground.scale.y	= 20*10
	ground.scale.z	= 1*10 
	// ground.scale.multiplyScalar(10)


	scene.fog = new THREE.Fog(0x000000,0,50);


	var trees = new THREE.Object3D();

	//var cubes = new THREE.Object3D();
   	var range = 60;


   	var verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
	];

	var indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
	];

	var arrayOfTreePos = [];

	$.get("php/betterMoviesPop.php",function(data){

		//console.log(JSON.parse(data));

		var array = JSON.parse(data);
		//console.log(array);
		makeDaTrees(array);
	});


	function makeDaTrees(data){

   	for(var i = 0; i < data.length; i++ ) {

   		var movieColor = data[i][2];

   		var rating = parseInt(data[i][3])/10;

   		var year = (2017-parseInt(data[i][1]))/100*2.6*5;

   		//console.log(data[i][1], year);

   		if(rating != rating) {
			rating = 0.1;
   		}

   		if(year != year) {
			year = 0.5;
   		}

   		var Box_material = new THREE.MeshPhongMaterial( {
       		color: 0x66493b,
       		shininess: 0,
       		specular: 0x222222,
       		shading: THREE.FlatShading
   		});

   		var Boll_material = new THREE.MeshPhongMaterial( {
       		color: new THREE.Color(movieColor),
       		shininess: 0,
       		specular: 0x222222,
       		shading: THREE.FlatShading
   		});
   		var polyGeo = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, rating, 1 );
    	var Box_geometry = new THREE.BoxGeometry(0.1,year,0.1); // generate psuedo-random geometry
    	//var BollGeo = new THREE.SphereGeometry( rating, 5, 5 );

       	var grayness = Math.random() * 0.5 + 0.25,
        mat = new THREE.MeshBasicMaterial();
       	var cube = new THREE.Mesh( Box_geometry, Box_material );
       	var boll = new THREE.Mesh( polyGeo, Boll_material );

       	cube.castShadow = true;
       	boll.castShadow = true;
       	//cube.receiveShadow = true;
       	mat.color.setRGB( grayness, grayness, grayness );
       	var x =  range * (0.5 - Math.random());
       	var z = range * (0.5 - Math.random())
       	//console.log(heightMap);
       	//console.log(mesh);
       	var y = THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, x, z);
       	//y = 0;
       	cube.rotateY(-Math.PI/1.5)
       	var treePosAndData = {};
       	treePosAndData["data"] = data[i];
       	treePosAndData["x"] = x;
       	treePosAndData["y"] = y;
       	treePosAndData["z"] = z;

       	arrayOfTreePos.push(treePosAndData);

       	cube.position.set(x,y,z);
       	boll.position.set(x,y+year/2+rating-0.1,z);
       	//cube.grayness = grayness; // *** NOTE THIS
       	trees.add( boll );
       	trees.add( cube );

       	if(i%10==0) {

       		var light = new THREE.PointLight( 0xffffff, 1, 10 );
			light.position.set( x, y, z );
			//scene.add( light );
		}
   }

   	trees.scale.multiplyScalar(1);
   	trees.castShadow = true;
   	scene.add( trees );

   }


   //console.log(treePosAndData);

   //console.log(arrayOfTreePos);

	//////////////////////////////////////////////////////////////////////////////////
	//		helpers to debug						//
	//////////////////////////////////////////////////////////////////////////////////

	// var helper	= new THREE.WireframeHelper(ground)
	// helper.material.color.set('black')
	// helper.position.y	= 0.1
	// scene.add(helper)

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////


	String.prototype.replaceAll = function(target, replacement) {
  		return this.split(target).join(replacement);
	};

		var player	= new THREEx.MinecraftPlayer()
	scene.add(player.character.root)
	updateFcts.push(function(delta, now){
		player.update(delta, now)
	})

	var prevPos = {"x":0, "y":0, "z":0};
	var moviePrev = "";
	
	updateFcts.push(function(delta, now){
		var position	= player.character.root.position
		position.y	= THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, position.x, position.z)
		if(prevPos.x==position.x && prevPos.z == position.z) {

		} else {
			//console.log(position);
			prevPos.x = position.x;
			prevPos.z = position.z;
			prevPos.y = position.y;

			for(var i in arrayOfTreePos) {

				if(arrayOfTreePos[i].x>position.x-1 && arrayOfTreePos[i].x<position.x+1 && arrayOfTreePos[i].z>position.z-1 && arrayOfTreePos[i].z<position.z+1) {
					if(moviePrev != arrayOfTreePos[i].data[0]) {

						//console.log(arrayOfTreePos[i].data[0])
						moviePrev = arrayOfTreePos[i].data[0];

						console.log(moviePrev);
						console.log(arrayOfTreePos[i].data[5]);
						var audio = new Audio(arrayOfTreePos[i].data[9]);
						audio.play();
						audio.volume = 1;
						setTimeout(function(){ audio.pause(); }, 3000);

					}

				}
			}
		} 
	})
	
	
	// attach camera to player
	player.character.root.add(camera)
	camera.position.z	= -2
	camera.position.y	= 1
	camera.lookAt(new THREE.Vector3(0,0.5,2))

	
	//////////////////////////////////////////////////////////////////////////////////
	//		controls.input based on keyboard				//
	//////////////////////////////////////////////////////////////////////////////////
	
	document.body.addEventListener('keydown', function(event){
		var input	= player.controls.input
		if( event.keyCode === 'W'.charCodeAt(0) )	input.up	= true
		if( event.keyCode === 'S'.charCodeAt(0) )	input.down	= true
		if( event.keyCode === 'A'.charCodeAt(0) )	input.left	= true
		if( event.keyCode === 'D'.charCodeAt(0) )	input.right	= true
	})
	document.body.addEventListener('keyup', function(event){
		var input	= player.controls.input
		if( event.keyCode === 'W'.charCodeAt(0) )	input.up	= false
		if( event.keyCode === 'S'.charCodeAt(0) )	input.down	= false
		if( event.keyCode === 'A'.charCodeAt(0) )	input.left	= false
		if( event.keyCode === 'D'.charCodeAt(0) )	input.right	= false
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	updateFcts.push(function(){
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
		updateFcts.forEach(function(updateFn){
			updateFn(deltaMsec/1000, nowMsec/1000)
		})
	})