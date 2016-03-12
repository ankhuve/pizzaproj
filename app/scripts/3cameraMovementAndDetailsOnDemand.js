var audio = new Audio();
var howFarAway = 3;
var audioPlaying = false;

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

            var closeTrees = []; // array with all the trees we are close to

            for(var i in arrayOfTreePos) {
                var currObj = arrayOfTreePos[i];

                var distanceX = Math.abs(currObj.x-position.x);
                var distanceY = Math.abs(currObj.z-position.z);
                var distanceMax = Math.max(distanceX, distanceY);
                var distVolume = (howFarAway-distanceMax)/(howFarAway);

                var isCurrentlyCloseToTree = currObj.x>position.x-howFarAway && currObj.x<position.x+howFarAway && currObj.z>position.z-howFarAway && currObj.z<position.z+howFarAway;

                if(isCurrentlyCloseToTree) {
                    var closeTree = { movie : [
                        {name : currObj.data[0]},
                        {data : currObj.data},
                        {distanceFromSelf : distanceMax}
                    ]};

                    closeTrees.push( closeTree ); // push all trees we are close to

                    movieMusicPlayer(currObj, distVolume);
                }
            }

            //console.log(closeTrees.length);

            if(closeTrees.length < 1) { // if we're not close to any trees anymore
                $("#informationHolder").html("");

                audio.volume = 0;
                audio.pause();

                //backAudio.play();

                audioPlaying = false;
            }
        }

        prevTime = time;

    }
}

function movieMusicPlayer( obj, distVolume ){
    if(moviePrev != obj.data[0]) {
        // if the nearby tree is a new one

        moviePrev = obj.data[0];

        audio.src = ""; // reset the previous song src
        audio.load();
        audio.src = obj.data[9];
        audio.play();
        //backAudio.volume = 0;

    } else{
        // if it's the previous one, just continue playing it
        audio.play();
        //backAudio.volume = 0;
    }

    $("#informationHolder").html(obj.data[0] + " (" + obj.data[1] + ")");

    audioPlaying = true;
    audio.volume = distVolume;
    if(0.05-distVolume>0) {
        backAudio.play();
        backAudio.volume = 0.05-distVolume;
    } else {
        backAudio.volume = 0;
        backAudio.pause();
    }


}
