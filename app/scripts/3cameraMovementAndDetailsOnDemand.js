var audio = new Audio();
var howFarAway = 3;
var audioPlaying = false;

var closeTrees;
var tooltip = document.getElementById('toolTipHolder');


function movementAndDetailsOnDemand() {
    if (controls.enabled) {
        //tooltip.style = "display:block;";

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // fixing velocity bug (crashing from menu when pausing during movement)
        if (velocity.x > -0.15 && velocity.x < 0.15) {
            velocity.x = 0;
        } else if (velocity.x > 15 || velocity.x < -15) {
            velocity.x = 0;
        }
        if (velocity.z > -0.15 && velocity.z < 0.15) {
            velocity.z = 0;
        } else if (velocity.z > 15 || velocity.z < -15) {
            velocity.z = 0;
        }


        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass, for jumping purposes

        if (moveForward) velocity.z -= movementSpeed * delta;
        if (moveBackward) velocity.z += movementSpeed * delta;

        if (moveLeft) velocity.x -= movementSpeed * delta;
        if (moveRight) velocity.x += movementSpeed * delta;


        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        var position = controls.getObject().position;

        position.y = THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, position.x, position.z) + 2;
        if (prevPos.x == position.x && prevPos.z == position.z) {

        } else {

            prevPos.x = position.x;
            prevPos.z = position.z;
            prevPos.y = position.y;

            closeTrees = []; // array with all the trees we are close to

            for (var i in arrayOfTreePos) {
                var currObj = arrayOfTreePos[i];

                var distanceX = Math.abs(currObj.x - position.x);
                var distanceY = Math.abs(currObj.z - position.z);
                var distanceMax = Math.max(distanceX, distanceY);
                var distVolume = (howFarAway - distanceMax) / (howFarAway);

                var isCurrentlyCloseToTree = currObj.x > position.x - howFarAway && currObj.x < position.x + howFarAway && currObj.z > position.z - howFarAway && currObj.z < position.z + howFarAway;

                if (isCurrentlyCloseToTree) {
                    var closeTree = {
                        movie: [
                            {
                                name: currObj.data[0]
                            },
                            {
                                data: currObj.data
                            },
                            {
                                distanceFromSelf: distanceMax
                            }
                    ]
                    };

                    if (currObj.visible) {
                        closeTrees.push(closeTree); // push all trees we are close to
                        movieMusicPlayer(currObj, distVolume);

                        tooltip.style = "display:block;";
                        $("#plotInfo").css("border-top", "1px solid #fff");
                        //$("#informationHolder").html("<div id='titleText'>" + currObj.data[0] + " (" + currObj.data[1] + ")</div></br><div id='infoInfo'>Press 'i' for more information.</div><div id='smallerInformation'><img class='icons' src='images/clapboard.png'> " + currObj.data[11] + "</br><img class='icons' src='images/actor.png'> " + currObj.data[10] + "</br><img class='icons' src='images/genre.png'> " + currObj.data[7] + "</br><img class='icons' src='images/rating.png'> " + currObj.data[3] + "</div><div id='plotInfo'>" + currObj.data[8] + "</div>");
                        $("#titleText").html(currObj.data[0]);
                        $("#titleYear").html(currObj.data[1]);
                        $("#plotInfo").html(currObj.data[8]);
                        $("#restInfo").html(currObj.data[3] + " | " + currObj.data[7] + " | " + currObj.data[11] + " | " + currObj.data[10]);
                    }
                }
            }

            //console.log(closeTrees.length);

            if (closeTrees.length < 1) { // if we're not close to any trees anymore
                //$("#informationHolder").html("");

                tooltip.style = "display:none;";

                audio.volume = 0;
                audio.pause();

                //backAudio.play();

                audioPlaying = false;
            }
        }

        prevTime = time;


    } else {
        audio.volume = 0;
        audio.pause();
        audioPlaying = false;

        tooltip.style = "display:none;";
    }
}

function movieMusicPlayer(obj, distVolume) {

    if(obj.data[5]){ // if the closest tree has a music track
        if (moviePrev != obj.data[0]) {
            // if the nearby tree is a new one

            moviePrev = obj.data[0];

            audio.src = ""; // reset the previous song src
            audio.load();
            audio.src = obj.data[9];
            if (muted == false) {
                audio.play();
            };
            //backAudio.volume = 0;

        } else {
            // if it's the previous one, just continue playing it
            if (muted == false) {
                audio.play();
            };
            //backAudio.volume = 0;
        }

        audioPlaying = true;
        audio.volume = distVolume;
        if (0.05 - (distVolume / 10) > 0) {
            if (muted == false) {
                backAudio.play();
                backAudio.volume = 0.05 - distVolume / 10;
            };

        } else {
            backAudio.volume = 0;
            backAudio.pause();
        }
    }



}