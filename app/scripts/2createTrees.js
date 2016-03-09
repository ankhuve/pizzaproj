
var trees = new THREE.Object3D();

//var cubes = new THREE.Object3D();
var range = 60;


var verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1
];

var indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];

var arrayOfTreePos = [];

$.get("php/betterMoviesPop.php",function(data){

    //console.log(JSON.parse(data));

    var array = JSON.parse(data);
    makeDaTrees(array);
});


function createYearScale( data ) {
    var botValue = 2050;
    var topValue = 1;
    data.forEach(function( movie ){
        var releaseYear = movie[1];

        if (releaseYear > topValue) {
            topValue = releaseYear;
        } else {
            if (releaseYear < botValue) {
                botValue = releaseYear;
            }
        }
    });

    console.log(botValue, topValue);
    return d3.scale.linear()
        .domain([botValue, topValue])
        .range([-range, range]);


}


function makeDaTrees(data){

    var releaseYearScale = createYearScale(data);

    for(var i = 0; i < data.length; i++ ) {

        // set data variables
        var yearOfRelease = parseInt(data[i][1]);
        var imdbRating = parseInt(data[i][3]);
        var moviePosterColor = data[i][2];

        // decide tree geometry data
        var treeCrownColor = moviePosterColor; // based on average movie poster color
        var treeCrownSize = imdbRating / 10; // based on movie rating
        var treeStemHeight = (2017 - yearOfRelease) / 100 * 13; // based on year of release

        var Box_material = new THREE.MeshPhongMaterial( {
            color: 0x66493b,
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading
        });

        var Boll_material = new THREE.MeshPhongMaterial( {
            color: new THREE.Color(treeCrownColor),
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading,
            displacementMap: ""
        });

        var polyGeo = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, treeCrownSize, 1 );
        var Box_geometry = new THREE.BoxGeometry(0.1, treeStemHeight, 0.1); // generate psuedo-random geometry
        //var BollGeo = new THREE.SphereGeometry( treeCrownSize, 5, 5 );

        var grayness = Math.random() * 0.5 + 0.25,
            mat = new THREE.MeshBasicMaterial();
        var cube = new THREE.Mesh( Box_geometry, Box_material );
        var boll = new THREE.Mesh( polyGeo, Boll_material );

        cube.castShadow = true;
        boll.castShadow = true;
        //cube.receiveShadow = true;
        mat.color.setRGB( grayness, grayness, grayness );
        var x =  releaseYearScale(yearOfRelease);
        var z = range * (0.5 - Math.random());
        var y = THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, x, z);

        cube.rotateY(-Math.PI/1.5);
        var treePosAndData = {};
        treePosAndData["data"] = data[i];
        treePosAndData["x"] = x;
        treePosAndData["y"] = y;
        treePosAndData["z"] = z;

        arrayOfTreePos.push(treePosAndData);

        cube.position.set(x, y, z);
        boll.position.set(x, y + treeStemHeight / 2 + treeCrownSize - 0.1, z);
        //cube.grayness = grayness; // *** NOTE THIS
        trees.add( boll );
        trees.add( cube );

        if(i%10==0) {

            var light = new THREE.PointLight( 0xffffff, 1, 10 );
            light.position.set( x, y, z );
            //scene.add( light );
        }
    }

    trees.scale.multiplyScalar(1);
    trees.castShadow = true;
    scene.add( trees );

}
