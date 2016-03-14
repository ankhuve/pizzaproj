function searchMovies(term) {


	var Boll2_material = new THREE.MeshPhongMaterial( {
            color: new THREE.Color("rgb(255,0,0)"),
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading,
            displacementMap: ""
    	});

	var BollGeo = new THREE.SphereGeometry(5, 10, 10 );

	var bollSearch = new THREE.Mesh(BollGeo, Boll2_material);


	if(term!="") {

		for(var i=0; i<arrayOfTreePos.length;i++) {
			thisMovie = arrayOfTreePos[i];
			thisMovieTitle = thisMovie.data[0].toLowerCase();
			thisMovieActors = thisMovie.data[10].toLowerCase();
			//console.log(thisMovieTitle, thisMovieActors);

			if((thisMovieTitle.indexOf(term.toLowerCase())!=-1) || (thisMovieActors.indexOf(term.toLowerCase())!=-1)) {
				console.log(thisMovie.data[0]);
				console.log(thisMovie.x, thisMovie.y, thisMovie.z);

				bollSearch.position.set(thisMovie.x, thisMovie.y+10, thisMovie.z);
				bollSearch.name = thisMovieTitle;
				scene.add(bollSearch);

			} else {
			}
		}
	} else {
	}
}