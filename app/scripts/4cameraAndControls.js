
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