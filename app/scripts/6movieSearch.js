function searchMovies(term) {

	//console.log(scene);

	var scenePlace = 3;
	var sceneMiniMapPlace = 4;


	for(var k=0; k<scene.children[scenePlace].children.length;k++) {		
		scene.children[scenePlace].children[k].visible = false;
		sceneMiniMap.children[sceneMiniMapPlace].children[k].visible = false;
	}

	if(term!="") {

		for(var i=0; i<arrayOfTreePos.length;i++) {
			thisMovie = arrayOfTreePos[i];
			thisMovieTitle = thisMovie.data[0].toLowerCase();
			thisMovieGenre = thisMovie.data[7].toLowerCase();
			thisMovieActors = thisMovie.data[10].toLowerCase();
			thisMovieYear = thisMovie.data[1].toLowerCase();

			if((thisMovieTitle.indexOf(term.toLowerCase())!=-1) || (thisMovieActors.indexOf(term.toLowerCase())!=-1) || (thisMovieGenre.indexOf(term.toLowerCase())!=-1) || (thisMovieYear.indexOf(term.toLowerCase())!=-1)) {
				for(var k=0; k<scene.children[scenePlace].children.length;k++) {
					if(scene.children[scenePlace].children[k].name.toLowerCase() == thisMovieTitle) {
						scene.children[scenePlace].children[k].visible = true;
						sceneMiniMap.children[sceneMiniMapPlace].children[k].visible = true;
					}
				}
			}
		}
	} else {
		for(var k=0; k<scene.children[scenePlace].children.length;k++) {
			scene.children[scenePlace].children[k].visible = true;
			sceneMiniMap.children[sceneMiniMapPlace].children[k].visible = true;
		}
	}
}