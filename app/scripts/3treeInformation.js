
	var audio, audioTimer;
	var speedNumb = 10;

	String.prototype.replaceAll = function(target, replacement) {
  		return this.split(target).join(replacement);
	};

	var player	= new THREEx.MinecraftPlayer(speedNumb)
	scene.add(player.character.root)
	updateFcts.push(function(delta, now){
		player.update(delta, now)
	})

	var prevPos = {"x":0, "y":0, "z":0};
	var moviePrev = "";
	
	updateFcts.push(function(delta, now){
		var position	= player.character.root.position
		position.y	= THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, position.x, position.z)
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
	})