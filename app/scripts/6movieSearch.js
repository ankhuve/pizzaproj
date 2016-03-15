
var term = "";
var minRatingVal = 0;
var maxRatingVal = 0;
var minYearVal = 0;
var maxYearVal = 0;

// without hemilight
var scenePlace = 3; // gets updated in searchMovies

// with hemilight
//var scenePlace = 4;
var sceneMiniMapPlace = 5; // gets updated in searchMovies

function searchMovies(updateSearchTerm, searchTerm) {

	for(var k=0; k<scene.children.length;k++) {
		if(scene.children[k].name == "allTrees") {
			scenePlace = k;
		}
	}

	for(var k=0; k<sceneMiniMap.children.length;k++) {
		if(sceneMiniMap.children[k].name == "allTrees") {
			sceneMiniMapPlace = k;
		}
	}

	treeArray = scene.children[scenePlace].children[0].children;
	treeArrayMini = sceneMiniMap.children[sceneMiniMapPlace].children[0].children;

	console.log(scene);
	
	if(updateSearchTerm) {
		term = searchTerm
	}

	for(var k=0; k<treeArray.length;k++) {		
		treeArray[k].visible = false;
		treeArrayMini[k].visible = false;
	}

	if(term!="") {

		for(var i=0; i<arrayOfTreePos.length;i++) {
			thisMovie = arrayOfTreePos[i];
			thisMovieTitle = thisMovie.data[0].toLowerCase();
			thisMovieGenre = thisMovie.data[7].toLowerCase();
			thisMovieActors = thisMovie.data[10].toLowerCase();
			thisMovieYear = thisMovie.data[1].toLowerCase();
			thisMovieRating = parseFloat(thisMovie.data[3].toLowerCase());

			if((thisMovieTitle.indexOf(term.toLowerCase())!=-1) || (thisMovieActors.indexOf(term.toLowerCase())!=-1) || (thisMovieGenre.indexOf(term.toLowerCase())!=-1) || (thisMovieYear.indexOf(term.toLowerCase())!=-1)) {
				
				if(parseInt(thisMovieYear)>=minYearVal && parseInt(thisMovieYear)<=maxYearVal && thisMovieRating>=minRatingVal && thisMovieRating<=maxRatingVal )

					for(var k=0; k<treeArray.length;k++) {
						if(treeArray[k].name.toLowerCase() == thisMovieTitle) {
							treeArray[k].visible = true;
							treeArrayMini[k].visible = true;
						}
					}
				}
			}
	} else {

		for(var i=0; i<arrayOfTreePos.length;i++) {
			thisMovie = arrayOfTreePos[i];
			thisMovieTitle = thisMovie.data[0].toLowerCase();
			thisMovieYear = thisMovie.data[1].toLowerCase();
			thisMovieRating = parseFloat(thisMovie.data[3].toLowerCase());
				
			if(parseInt(thisMovieYear)>=minYearVal && parseInt(thisMovieYear)<=maxYearVal && thisMovieRating>=minRatingVal && thisMovieRating<=maxRatingVal ) {
				for(var k=0; k<treeArray.length;k++) {
					if(treeArray[k].name.toLowerCase() == thisMovieTitle) {
						treeArray[k].visible = true;
						treeArrayMini[k].visible = true;
					}
				}
			}
		}

	}
}

function initiateSearchAndBars() {

	minRatingVal = Math.min.apply(Math,arrayOfTreePos.map(function(o){return parseFloat(o.data[3]);}))
	maxRatingVal = Math.max.apply(Math,arrayOfTreePos.map(function(o){return parseFloat(o.data[3]);}))

	minYearVal = Math.min.apply(Math,arrayOfTreePos.map(function(o){return parseFloat(o.data[1]);}))
	maxYearVal = Math.max.apply(Math,arrayOfTreePos.map(function(o){return parseFloat(o.data[1]);}))

	var clickTimes = 0;

	$('#settingsIcon').click(function(event){
	    event.stopPropagation();
	    if(clickTimes%2==0) {
	    	$(".searchBar").addClass("searchBarShow");
		} else {
			$(".searchBar").removeClass("searchBarShow");
		}
		clickTimes++;
	})

	sliders = document.getElementsByClassName('slider');
	startArr = [[minRatingVal,maxRatingVal],[minYearVal,maxYearVal]];
	rangeArr = [{'min':minRatingVal, 'max':maxRatingVal},{'min':minYearVal, 'max':maxYearVal}];
	stepArr = [0.1,1];

	for ( var i = 0; i < sliders.length; i++ ) {

		noUiSlider.create(sliders[i], {
			start: startArr[i],
			range: rangeArr[i],
			connect: true,
			tooltips: false,
			step: stepArr[i]
		});

		sliders[i].noUiSlider.on('slide', setBars);
	}
}

function setBars() {
	minRatingVal = parseFloat(sliders[0].noUiSlider.get()[0]);
	maxRatingVal = parseFloat(sliders[0].noUiSlider.get()[1]);
	minYearVal = parseInt(sliders[1].noUiSlider.get()[0]);
	maxYearVal = parseInt(sliders[1].noUiSlider.get()[1]);
	//console.log(minRating, maxRating, minYear, maxYear);
	searchMovies(false,"")
}



