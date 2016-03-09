var audio, audioTimer;
var speedNumb = 10;

function movementAndDetailsOnDemand(){
    if ( controlsEnabled ) {
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass, for jumping purposes

        if ( moveForward ) velocity.z -= movementSpeed * delta;
        if ( moveBackward ) velocity.z += movementSpeed * delta;

        if ( moveLeft ) velocity.x -= movementSpeed * delta;
        if ( moveRight ) velocity.x += movementSpeed * delta;


        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        var position = controls.getObject().position;

        position.y	= THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, position.x, position.z) + 2;
        if(prevPos.x==position.x && prevPos.z == position.z) {

        } else {
            prevPos.x = position.x;
            prevPos.z = position.z;
            prevPos.y = position.y;

            var howFarAway = 3;

            for(var i in arrayOfTreePos) {



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
}

