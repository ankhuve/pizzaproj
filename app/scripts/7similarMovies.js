function findSimilarMovies(movie) {

	// create object to contain movie name and vector of similar movies
	var movieObject = {};
	for (var k = 0; k < arrayOfTreePos.length; k++) movieObject[arrayOfTreePos[k].data[0].toLowerCase()] = 0;

	var orgMovieTitle = movie[0].toLowerCase();

	// go through all actors and genres of chosen movie and find movies containing those actors and genres
	var actorGenreArr = [10,7];
	for( var w = 0; w < actorGenreArr.length; w++) {

		var attrArr = movie[actorGenreArr[w]].split(",");
		for( var j = 0; j < attrArr.length; j++) {

			var attrName = attrArr[j].trim();

			for (var i = 0; i < arrayOfTreePos.length; i++) {

	            thisMovie = arrayOfTreePos[i];
	            thisMovieTitle = thisMovie.data[0].toLowerCase();
	            thisMovieAttr = thisMovie.data[actorGenreArr[w]].toLowerCase();

	            if(thisMovieTitle != orgMovieTitle) {

	            	if(thisMovieAttr.indexOf(attrName.toLowerCase()) != -1) {
	            		movieObject[thisMovieTitle] += 1;
	            	}
	            }
	    	}
		}

	}


	for (var k = 0; k < scene.children.length; k++) {
        if (scene.children[k].name == "allTrees") {
            scenePlace = k;
        }
    }

    for (var k = 0; k < sceneMiniMap.children.length; k++) {
        if (sceneMiniMap.children[k].name == "allTrees") {
            sceneMiniMapPlace = k;
        }
    }

    treeArraySim = scene.children[scenePlace].children[0].children;
    treeArrayMiniSim = sceneMiniMap.children[sceneMiniMapPlace].children[0].children;

    for (var k = 0; k < treeArraySim.length; k++) {
        treeArraySim[k].visible = false;
        treeArrayMiniSim[k].visible = false;
    }

    for (var i = 0; i < arrayOfTreePos.length; i++) {
    	arrayOfTreePos[i].visible = false;
    }

	var sortable = [];
	for (var i in movieObject) {
      	sortable.push([i, movieObject[i]])
		sortable.sort(function(a, b) {return b[1] - a[1]})
	}

	sortable.unshift([movie[0].toLowerCase(),1000]);

	for (var j = 0; j<11; j++) {
		for (var i = 0; i < arrayOfTreePos.length; i++) {
			if(sortable[j][0]==arrayOfTreePos[i].data[0].toLowerCase()) {
    			arrayOfTreePos[i].visible = true;
    		}
    	}

    	for (var k = 0; k < treeArraySim.length; k++) {
    		if (treeArraySim[k].name.toLowerCase() == sortable[j][0]) {
        		treeArraySim[k].visible = true;
        		treeArrayMiniSim[k].visible = true;
        	}
    	}
	}
}