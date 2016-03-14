function searchMovies(term) {

	console.log(scene);


	for(var k=0; k<scene.children[3].children.length;k++) {
		scene.children[3].children[k].visible = false;
		sceneMiniMap.children[3].children[k].visible = false;
	}

	if(term!="") {

		for(var i=0; i<arrayOfTreePos.length;i++) {
			thisMovie = arrayOfTreePos[i];
			thisMovieTitle = thisMovie.data[0].toLowerCase();
			thisMovieGenre = thisMovie.data[7].toLowerCase();
			thisMovieActors = thisMovie.data[10].toLowerCase();
			thisMovieYear = thisMovie.data[1].toLowerCase();

			if((thisMovieTitle.indexOf(term.toLowerCase())!=-1) || (thisMovieActors.indexOf(term.toLowerCase())!=-1) || (thisMovieGenre.indexOf(term.toLowerCase())!=-1) || (thisMovieYear.indexOf(term.toLowerCase())!=-1)) {
				for(var k=0; k<scene.children[3].children.length;k++) {
					if(scene.children[3].children[k].name.toLowerCase() == thisMovieTitle) {
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