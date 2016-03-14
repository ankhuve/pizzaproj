function searchMovies(term) {


	for(var k=0; k<scene.children[3].children.length;k++) {
		scene.children[3].children[k].visible = false;
		sceneMiniMap.children[3].children[k].visible = false;
	}

	if(term!="") {

		for(var i=0; i<arrayOfTreePos.length;i++) {
			thisMovie = arrayOfTreePos[i];
			thisMovieTitle = thisMovie.data[0].toLowerCase();
			thisMovieActors = thisMovie.data[10].toLowerCase();

			if((thisMovieTitle.indexOf(term.toLowerCase())!=-1) || (thisMovieActors.indexOf(term.toLowerCase())!=-1)) {
				for(var k=0; k<scene.children[3].children.length;k++) {
					if(scene.children[3].children[k].position.x == thisMovie.x && scene.children[3].children[k].position.z == thisMovie.z){
						scene.children[3].children[k].visible = true;
						sceneMiniMap.children[3].children[k].visible = true;
					}
				}
			}
		}
	} else {
		for(var k=0; k<scene.children[3].children.length;k++) {
			scene.children[3].children[k].visible = true;
			sceneMiniMap.children[3].children[k].visible = true;
		}
	}
}