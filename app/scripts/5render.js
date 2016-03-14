var prevPos = {"x":0, "y":0, "z":0};
var moviePrev = "";


function animate() {
	var w = window.innerWidth, h = window.innerHeight;

	if(!controls.enabled) {
		controls.getObject().rotation.y -= Math.PI/5000;
	}

	//mapCamera.rotation.z = controls.getObject().rotation.y;

	//cloudObj.position.x +=Math.PI/50;
	//circle.position.x = controls.getObject().position.x;
	triangle.position.set( controls.getObject().position.x, controls.getObject().position.y+10, controls.getObject().position.z )
	//triangle.rotation.x = -Math.PI/2;
	triangle.rotation.x = -Math.PI/2;
	triangle.rotation.z = (controls.getObject().rotation.y)-44.91;


	//console.log(circle.position.x);

    requestAnimationFrame( animate );

    movementAndDetailsOnDemand();

	// setViewport parameters:
	renderer.setViewport( 0, 0, w, h );
	renderer.clear();

	// Depth of Field
	//depthOfField= new THREEx.DepthOfField(renderer)
	//depthOfField.render(scene, camera)
	
	// full display
	
	renderer.render( scene, camera );

	// minimap (overhead orthogonal camera)
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	renderer.setViewport(0, 200, mapWidth, mapHeight );
	renderer.render( sceneMiniMap, mapCamera);


}