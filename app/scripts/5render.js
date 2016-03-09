var prevPos = {"x":0, "y":0, "z":0};
var moviePrev = "";

function animate() {

	if(!controls.enabled) {
		camera.rotation.y -= Math.PI/5000;
	}

    requestAnimationFrame( animate );

    movementAndDetailsOnDemand();

    renderer.render( scene, camera );

}