var prevPos = {"x":0, "y":0, "z":0};
var moviePrev = "";

function animate() {
	var w = window.innerWidth, h = window.innerHeight;

	if(!controls.enabled) {
		controls.getObject().rotation.y -= Math.PI/5000;
	}

    requestAnimationFrame( animate );

    movementAndDetailsOnDemand();

	// setViewport parameters:
	renderer.setViewport( 0, 0, w, h );
	renderer.clear();
	
	// full display
	renderer.render( scene, camera );

	// minimap (overhead orthogonal camera)
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
	renderer.render( scene, mapCamera );


}