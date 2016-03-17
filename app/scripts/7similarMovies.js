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

	console.log(movieObject);

	var sortable = [];
	for (var i in movieObject) {
      	sortable.push([i, movieObject[i]])
		sortable.sort(function(a, b) {return b[1] - a[1]})
	}

	for (var j = 0; j<10; j++) {
		console.log(sortable[j][0]);
	}
}