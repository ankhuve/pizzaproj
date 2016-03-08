var prevPos = {"x":0, "y":0, "z":0};
var moviePrev = "";

function animate() {

    requestAnimationFrame( animate );

    if ( controlsEnabled ) {
        //raycaster.ray.origin.copy( controls.getObject().position );
        //raycaster.ray.origin.y -= 10;

        //var intersections = raycaster.intersectObjects( objects );

        //var isOnObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if ( moveForward ) velocity.z -= 400.0 * delta;
        if ( moveBackward ) velocity.z += 400.0 * delta;

        if ( moveLeft ) velocity.x -= 400.0 * delta;
        if ( moveRight ) velocity.x += 400.0 * delta;

        //if ( isOnObject === true ) {
        //	velocity.y = Math.max( 0, velocity.y );
        //
        //canJump = true;
        //}

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        var position	= camera;
        console.log();
        position.y	= THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, position.x, position.z);
        if(prevPos.x==position.x && prevPos.z == position.z) {

        } else {
            //console.log(position);
            prevPos.x = position.x;
            prevPos.z = position.z;
            prevPos.y = position.y;

            for(var i in arrayOfTreePos) {

                howFarAway = 3;

                if(arrayOfTreePos[i].x>position.x-howFarAway && arrayOfTreePos[i].x<position.x+howFarAway && arrayOfTreePos[i].z>position.z-howFarAway && arrayOfTreePos[i].z<position.z+howFarAway) {


                    if(moviePrev != arrayOfTreePos[i].data[0]) {

                        moviePrev = arrayOfTreePos[i].data[0];

                        //console.log(moviePrev);
                        console.log(arrayOfTreePos[i].data);

                        $("#informationHolder").html(arrayOfTreePos[i].data[0]);

                        audio = new Audio(arrayOfTreePos[i].data[9]);
                        audio.play();
                        audio.volume = 0;
                        audioTimer = setTimeout(function(){ $(audio).animate({volume: 0}, 1000); }, 29000);

                    }

                    var distanceX = Math.abs(arrayOfTreePos[i].x-position.x);
                    var distanceY = Math.abs(arrayOfTreePos[i].z-position.z);
                    var distanceMax = Math.max(distanceX, distanceY);
                    var distVolume = (howFarAway-distanceMax)/(howFarAway*8);

                    audio.volume = distVolume;

                    //console.log(audio.volume);

                    if(distanceMax>2.8) {
                        $("#informationHolder").html("");
                        audio.volume = 0;
                        audio.pause();
                        moviePrev = "";
                        clearTimeout(audioTimer);
                    }

                }
            }
        }

        prevTime = time;

    }

    renderer.render( scene, camera );

}


//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////
//updateFcts.push(function(){
//	renderer.render( scene, camera );
//});

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
//var lastTimeMsec = null;
//
//requestAnimationFrame(function animate(nowMsec){
//	// keep looping
//	requestAnimationFrame( animate );
//	// measure time
//	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
//	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
//	lastTimeMsec	= nowMsec;
//	// call each update function
//	updateFcts.forEach(function(updateFn){
//		updateFn(deltaMsec/1000, nowMsec/1000)
//	})
//});