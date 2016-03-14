
var camera, scene;
var geometry, material, mesh;
var controls;
var mapCamera, mapWidth = window.innerWidth, mapHeight = window.innerHeight + 220;

var objects = [];

var raycaster;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

//  marker that follows player
var material = new THREE.MeshBasicMaterial({
	color: 0xffffff
});

  
var geom = new THREE.Geometry();
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(-5,0,0);
var v3 = new THREE.Vector3(-5,-5,0);


geom.vertices.push( v1 );
geom.vertices.push( v2 );
geom.vertices.push( v3 );

geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
geom.computeFaceNormals();

//triangle marker created
var triangle = new THREE.Mesh( geom, material );

//center the rotation
geom.center();

sceneMiniMap.add( triangle );

// x axis (time-axis)

var material = new THREE.LineBasicMaterial({
	color: 0xffffff
});

var geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( -50, 0, 0 ),
	new THREE.Vector3( 0, 100,  0),
	new THREE.Vector3( 70, 0, 0 )
);

var line = new THREE.Line( geometry, material );
line.position.z = 50;
sceneMiniMap.add( line );

// y axis (oter axis)

var material = new THREE.LineBasicMaterial({
	color: 0xffffff
});

var geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( 0, 0, -50 ),
	new THREE.Vector3( 0, 100,  0),
	new THREE.Vector3( 0, 0, 50 )
);

var otherLine = new THREE.Line( geometry, material );
otherLine.position.x = -50;
sceneMiniMap.add( otherLine );

//x-axis (year)
	var xaxis = makeTextSprite( "YEAR ", 
		{ fontsize: 24, fontface: "Arial" } );
	xaxis.position.set(95,105,62);
	sceneMiniMap.add( xaxis );

//y-axis (current:random)
	var xaxis = makeTextSprite( "RANDOM ", 
		{ fontsize: 24, fontface: "Arial" } );
	xaxis.position.set(5,105,-25);
	sceneMiniMap.add( xaxis );


// orthographic cameras (minimap)
mapCamera = new THREE.OrthographicCamera(
 -62,		// Left  // 
window.innerWidth / 2,		// Right 
window.innerHeight / 2,		// Top 
-200,	// Bottom 
-5000,            			// Near 
10000 );           			// Far 
mapCamera.up = new THREE.Vector3(0,0,-1);  //rotation i x,y,z på mappen
mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
mapCamera.position.y = 500;

scene.add(mapCamera);

// EVENTS FOR MINMAP
THREEx.WindowResize(renderer, mapCamera);

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			controlsEnabled = true;
			controls.enabled = true;

			blocker.style.display = 'none';
			$("#centerSign").css("display", "block");

			$("#searchBar").css("display", "none");
			
			audio.play();

		} else {
			//controlsEnabled = false;
			controls.enabled = false;

			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';

			instructions.style.display = '';
			$("#centerSign").css("display", "none");
			$("#searchBar").css("display", "block");
			audio.play();
			audio.pause();
		

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
var movementSpeed = 100;

var isMoving = 0;

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

	camera.position.y = 0;
	camera.position.z = 0;

	controls = new THREE.PointerLockControls( camera );
	controls.getObject().rotation.y = -Math.PI/2;
	scene.add( controls.getObject() );

	footsteps = new Audio('sounds/steps.mp3');
	footsteps.loop = true;
	footsteps.volume = 0.1;
	footsteps.playbackRate = 1.5;

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				if(controls.enabled){
					moveForward = true;
					footsteps.play();
				}
				break;

			case 37: // left
			case 65: // a
				if(controls.enabled){
					moveLeft = true;
					footsteps.play();
				}
				break;

			case 40: // down
			case 83: // s
				if(controls.enabled){
					moveBackward = true;
					footsteps.play();
				}
				break;

			case 39: // right
			case 68: // d
				if(controls.enabled){
					moveRight = true;
					footsteps.play();
				}
				break;

			//case 32: // kanske lägga till flygfunktion?! trycker man space så börjar man flyga eller nåt
			//	if ( canJump === true ) velocity.y += 350;
			//	canJump = false;
			//	break;

		}
		// moved this outside onKeyDown event to load camera instantly
		// renderer.setSize( window.innerWidth, window.innerHeight );
		// renderer.setClearColor( 0x000000, 1 );
		// renderer.autoClear = false;

	};

	// I put this outside the onKeyDown event to load camera instantly
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 1 );
	renderer.autoClear = false;

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				footsteps.pause();
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				footsteps.pause();
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				footsteps.pause();
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				footsteps.pause();
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	window.addEventListener( 'resize', onWindowResize, false );


}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}



