$(function(){
/*Work on v72  */
			var geometry, material, mesh;
            var scene, camera, renderer, camControls, clock;
            var controls;
            var stats;
            var spotLight, cube;
            var SCREEN_WIDTH, SCREEN_HEIGHT;
			var objects = [];

			var raycaster;

			var blocker = document.getElementById( 'blocker' );
			var instructions = document.getElementById( 'instructions' );

			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			if ( havePointerLock ) {

				var element = document.body;

				var pointerlockchange = function ( event ) {

					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

						controlsEnabled = true;
						controls.enabled = true;

						blocker.style.display = 'none';

					} else {

						controls.enabled = false;

						blocker.style.display = '-webkit-box';
						blocker.style.display = '-moz-box';
						blocker.style.display = 'box';

						instructions.style.display = '';

					}

				};

				var pointerlockerror = function ( event ) {

					instructions.style.display = '';

				};

				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.addEventListener( 'click', function ( event ) {

					instructions.style.display = 'none';

					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

					if ( /Firefox/i.test( navigator.userAgent ) ) {

						var fullscreenchange = function ( event ) {

							if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

								document.removeEventListener( 'fullscreenchange', fullscreenchange );
								document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

								element.requestPointerLock();
							}

						};

						document.addEventListener( 'fullscreenchange', fullscreenchange, false );
						document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

						element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

						element.requestFullscreen();

					} else {

						element.requestPointerLock();

					}

				}, false );

			} else {

				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

			}

			init();
			animate();

			var controlsEnabled = false;

			var moveForward = false;
			var moveBackward = false;
			var moveLeft = false;
			var moveRight = false;
			var canJump = false;

			var prevTime = performance.now();
			var velocity = new THREE.Vector3();

			function init() {

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
                camera.position.x = 1;
                camera.position.y = 0;
                camera.position.z = 65;

				scene = new THREE.Scene();
				scene.fog = new THREE.Fog( 0xffffff, 0, 750 );


				controls = new THREE.PointerLockControls( camera );
				scene.add( controls.getObject() );

				var onKeyDown = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = true;
							break;

						case 37: // left
						case 65: // a
							moveLeft = true; break;

						case 40: // down
						case 83: // s
							moveBackward = true;
							break;

						case 39: // right
						case 68: // d
							moveRight = true;
							break;

						case 32: // space
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;

					}

				};

				var onKeyUp = function ( event ) {

					switch( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = false;
							break;

						case 37: // left
						case 65: // a
							moveLeft = false;
							break;

						case 40: // down
						case 83: // s
							moveBackward = false;
							break;

						case 39: // right
						case 68: // d
							moveRight = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );

				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
                var ambient = new THREE.AmbientLight( 0x404040 );
                scene.add( ambient );
                
                var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
                pointLight.position.set( 0, 20, 0 );
                pointLight.castShadow = true;
                pointLight.shadowCameraNear = 8;
                pointLight.shadowCameraFar = 300;
                pointLight.shadowDarkness = 0.5;
                pointLight.shadowCameraVisible = false;
                pointLight.shadowMapWidth = 1024;
                pointLight.shadowMapHeight = 1024;
                scene.add( pointLight );

                var sphereSize = 1;
                var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
                scene.add( pointLightHelper );
                
				// floor

                grid = new THREE.GridHelper(50, 5);
                color = new THREE.Color("rgb(255,0,0)");
                grid.setColors(color, 0x000000);
                scene.add(grid);

            /*Ground*/
            var Ground_geometry = new THREE.BoxGeometry( 20, 0.1, 20 );
            var Ground_material = new THREE.MeshPhongMaterial( {
                color: 0xa0adaf,
                shininess: 0,
                specular: 0xffffff,
                shading: THREE.SmoothShading
            } );
    
            var ground = new THREE.Mesh( Ground_geometry, Ground_material );
            ground.scale.multiplyScalar( 5 );
            ground.castShadow = false;
            ground.receiveShadow = true;
            scene.add( ground );
    
            /*Box*/
            var Box_material = new THREE.MeshPhongMaterial( {
                color: 0xff0000,
                shininess: 0,
                specular: 0x222222,
                shading: THREE.SmoothShading,
            } );
    
            var Box_geometry = new THREE.BoxGeometry( 1, 3, 1 );
           
    
            cubes = new THREE.Object3D();
            scene.add( cubes );
            var range = 100;
    
            for(var i = 0; i < 1000; i++ ) {
                var grayness = Math.random() * 0.5 + 0.25,
                mat = new THREE.MeshBasicMaterial();
                cube = new THREE.Mesh( Box_geometry, Box_material );
                cube.castShadow = true;
                cube.receiveShadow = true;
                mat.color.setRGB( grayness, grayness, grayness );
                cube.position.set( range * (0.5 - Math.random()), 1.6, range * (0.5 - Math.random()) );
                //cube.grayness = grayness; // *** NOTE THIS
                cubes.add( cube );
            }

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0xffffff );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.shadowMap.enabled = true;
                renderer.shadowMapSoft = true;

				document.body.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				if ( controlsEnabled ) {
					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;

					var intersections = raycaster.intersectObjects( objects );

					var isOnObject = intersections.length > 0;

					var time = performance.now();
					var delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					if ( moveForward ) velocity.z -= 400.0 * delta;
					if ( moveBackward ) velocity.z += 400.0 * delta;

					if ( moveLeft ) velocity.x -= 400.0 * delta;
					if ( moveRight ) velocity.x += 400.0 * delta;

					if ( isOnObject === true ) {
						velocity.y = Math.max( 0, velocity.y );

						canJump = true;
					}

					controls.getObject().translateX( velocity.x * delta );
					controls.getObject().translateY( velocity.y * delta );
					controls.getObject().translateZ( velocity.z * delta );

					if ( controls.getObject().position.y < 10 ) {

						velocity.y = 0;
						controls.getObject().position.y = 10;

						canJump = true;

					}

					prevTime = time;

				}

				renderer.render( scene, camera );

			}
//    
//    /*global variables*/
//    var scene, camera, renderer, camControls, clock, flyControls;
//    var controls;
//    var stats;
//    var spotLight, cube;
//    var SCREEN_WIDTH, SCREEN_HEIGHT;
//
//
//    function init(){
//        /*creates empty scene object and renderer*/
//        clock = new THREE.Clock();
//        scene = new THREE.Scene();
//        camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
//        renderer = new THREE.WebGLRenderer({antialias:true});
//
//        renderer.setClearColor(0xdddddd);
//        renderer.setSize(window.innerWidth, window.innerHeight);
//        renderer.shadowMap.enabled = true;
//        renderer.shadowMapSoft = true;
//
//        /*add controls*/
//        controls = new THREE.OrbitControls( camera, renderer.domElement );
//       // controls = new THREE.PointerLockControls( camera );
//
//        controls.addEventListener( 'change', render );
//
//        /*adds helpers*/
//        axis =  new THREE.AxisHelper(10);
//        scene.add (axis);
//
//        grid = new THREE.GridHelper(50, 5);
//        color = new THREE.Color("rgb(255,0,0)");
//        grid.setColors(color, 0x000000);
//        scene.add(grid);
//
//        /*Camera*/
//        camera.position.x = 40;
//        camera.position.y = 25;
//        camera.position.z = 40;
//        camera.lookAt(scene.position);
//
//        /*Control the camera with the mouse when canvas has been clicked */
//        var camControls = new THREE.FirstPersonControls(camera, renderer.domElement);
//        camControls.lookSpeed = 0.4;
//        camControls.movementSpeed = 10;
//        camControls.noFly = true;
//        camControls.lookVertical = true;
//        camControls.constrainVertical = true;
//        camControls.verticalMin = 1.0;
//        camControls.verticalMax = 2.0;
//        camControls.lon = -150;
//        camControls.lat = 120;
//
//        
//        /*Lights*/
//        var ambient = new THREE.AmbientLight( 0x404040 );
//        scene.add( ambient );
//
///* 
//        spotLight = new THREE.SpotLight( 0xffffff );
//        spotLight.position.set(15, 20, 15 );
//        spotLight.castShadow = true;
//        spotLight.shadowCameraNear = 8;
//        spotLight.shadowCameraFar = 300;
//        spotLight.shadowDarkness = 0.5;
//        spotLight.shadowCameraVisible = false;
//        spotLight.shadowMapWidth = 1024;
//        spotLight.shadowMapHeight = 1024;
//        spotLight.name = 'Spot Light';
//        scene.add( spotLight );
//
//        */
//
//        var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
//        pointLight.position.set( 0, 20, 0 );
//        pointLight.castShadow = true;
//        pointLight.shadowCameraNear = 8;
//        pointLight.shadowCameraFar = 300;
//        pointLight.shadowDarkness = 0.5;
//        pointLight.shadowCameraVisible = false;
//        pointLight.shadowMapWidth = 1024;
//        pointLight.shadowMapHeight = 1024;
//        scene.add( pointLight );
//
//        var sphereSize = 1;
//        var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
//        scene.add( pointLightHelper );
//
//        /*Ground*/
//        var Ground_geometry = new THREE.BoxGeometry( 20, 0.1, 20 );
//        var Ground_material = new THREE.MeshPhongMaterial( {
//            color: 0xa0adaf,
//            shininess: 0,
//            specular: 0xffffff,
//            shading: THREE.SmoothShading
//        } );
//
//        var ground = new THREE.Mesh( Ground_geometry, Ground_material );
//        ground.scale.multiplyScalar( 5 );
//        ground.castShadow = false;
//        ground.receiveShadow = true;
//        scene.add( ground );
//
//        /*Box*/
//        var Box_material = new THREE.MeshPhongMaterial( {
//            color: 0xff0000,
//            shininess: 0,
//            specular: 0x222222,
//            shading: THREE.SmoothShading,
//        } );
//
//        var Box_geometry = new THREE.BoxGeometry( 1, 3, 1 );
//       
//
//        cubes = new THREE.Object3D();
//        scene.add( cubes );
//        var range = 100;
//
//        for(var i = 0; i < 1000; i++ ) {
//            var grayness = Math.random() * 0.5 + 0.25,
//            mat = new THREE.MeshBasicMaterial();
//            cube = new THREE.Mesh( Box_geometry, Box_material );
//            cube.castShadow = true;
//            cube.receiveShadow = true;
//            mat.color.setRGB( grayness, grayness, grayness );
//            cube.position.set( range * (0.5 - Math.random()), 1.6, range * (0.5 - Math.random()) );
//            //cube.grayness = grayness; // *** NOTE THIS
//            cubes.add( cube );
//        }
//
//
//        $("#holder").append(renderer.domElement);
//
//    }
//
//    function setCamControls() {
//    }
//    
//    function render() {
//
//    }
//
//    function animate(){
//        //update camera control pos
//        var delta = clock.getDelta();
//        time = clock.getElapsedTime() * 10;
//        requestAnimationFrame(animate);
//        controls.update(delta);
//        renderer.render( scene, camera );
//        
//
//        render();
//
//    }
//
//    init();
//    animate();
//
//    $(window).resize(function(){
//        SCREEN_WIDTH = window.innerWidth;
//        SCREEN_HEIGHT = window.innerHeight;
//        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
//        camera.updateProjectionMatrix();
//        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
//    });

});	



