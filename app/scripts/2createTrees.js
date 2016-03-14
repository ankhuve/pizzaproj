var trees = new THREE.Object3D();

//var cubes = new THREE.Object3D();
var range = 50;


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

    return d3.scale.linear()
        .domain([botValue, topValue])
        .range([-range, range]);
}


function makeDaTrees(data){

    var releaseYearScale = createYearScale(data);

    //console.log(data);

    for(var i = 0; i < data.length; i++ ) {

        // set data variables
        var yearOfRelease = parseInt(data[i][1]);
        var imdbRating = parseInt(data[i][3]);
        var moviePosterColor = data[i][2];

        // decide tree geometry data
        var treeCrownColor = moviePosterColor; // based on average movie poster color
        var treeCrownSize = imdbRating/(10-imdbRating) / 5; // based on movie rating
        var treeStemHeight = (2017 - yearOfRelease) / 100 * 13; // based on year of release

        var Box_material = new THREE.MeshPhongMaterial( {
            color: 0x66493b,
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading
        });

        Boll_material = new THREE.MeshPhongMaterial( {
            color: new THREE.Color(treeCrownColor),
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading,
            displacementMap: "",
            transparent: true
        });

        var Boll2_material = new THREE.MeshPhongMaterial( {
            color: new THREE.Color("rgb(255,0,0)"),
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading,
            displacementMap: "",
        });

        var polyGeo = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, treeCrownSize, 1 );
        var Box_geometry = new THREE.BoxGeometry(0.1, treeStemHeight, 0.1); // generate psuedo-random geometry

        var polyGeo2 = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 0.1, 1 );

        //var BollGeo = new THREE.SphereGeometry( treeCrownSize, 10, 10 );

        var grayness = Math.random() * 0.5 + 0.25,
            mat = new THREE.MeshBasicMaterial();
        var cube = new THREE.Mesh( Box_geometry, Box_material );
        //var boll = new THREE.Mesh( polyGeo, Boll_material );
        var boll = new THREE.Mesh(polyGeo, Boll_material);
        var boll2 = new THREE.Mesh( polyGeo2, Boll2_material );

        cube.castShadow = true;
        boll.castShadow = true;
        //cube.receiveShadow = true;
        mat.color.setRGB( grayness, grayness, grayness );
        var x =  releaseYearScale(yearOfRelease);
        var z = range * (0.5 - Math.random());

        // check if trees are nearby, inrease z until no collision detected

        var constCheck = true;
        var treeRange = 4;

        while(constCheck) {
            var collisionNumb = 0;
            for(var j = 0; j <arrayOfTreePos.length; j++) {
                if(data[i][0]!=arrayOfTreePos[j].data[0]){
                    var innerTreeX = arrayOfTreePos[j].x;
                    var innerTreeZ = arrayOfTreePos[j].z;
                    var hypo = Math.hypot(Math.abs(x-innerTreeX),Math.abs(z-innerTreeZ));
                    if(hypo<treeRange) {
                        if(z<0) {
                            z-=1;
                        } else {
                           z += 1; 
                        }
                        
                        collisionNumb++;
                    }
                }
            }

            if(collisionNumb==0) {
                constCheck = false;
            }
            
        }

        //z = 0;

        var y = THREEx.Terrain.planeToHeightMapCoords(heightMap, ground, x, z);
       

        cube.rotateY(-Math.PI/1.5);
        var treePosAndData = {};
        treePosAndData["data"] = data[i];
        treePosAndData["x"] = x;
        treePosAndData["y"] = y;
        treePosAndData["z"] = z;

        arrayOfTreePos.push(treePosAndData);

        //console.log(arrayOfTreePos[i].x, arrayOfTreePos[i].z);

        cube.position.set(x, y, z);
        boll.position.set(x, y + treeStemHeight / 2 + treeCrownSize - 0.1, z);


        
        //cube.grayness = grayness; // *** NOTE THIS

        // set color underneath tree
        colorGround(x,z,y,moviePosterColor);

        boll.name = data[i][0];
        cube.name = data[i][0];
        boll2.name = data[i][0];

        trees.add( boll );
        trees.add( cube );


        //console.log(data[i]);


        if(data[i][9]!="") {
            boll2.position.set(x, (y + treeStemHeight / 2 + treeCrownSize - 0.1)+2, z);
            trees.add( boll2 );
            
        }

        // if(i%50==0) {

        //     var light = new THREE.PointLight( 0xffffff, 1, 10 );
        //     light.position.set( x, y, z );
        //     scene.add( light );
        // }
    }

    trees.scale.multiplyScalar(1);
    trees.castShadow = true;
    scene.add( trees );
    sceneMiniMap.add( trees.clone() ); 

    // now that we changed the color of vertices, add ground
    scene.add( ground );
}

function colorGround(xVar, zVar, yVar, moviePosterColor) {

    var vertexRange = 2;
    // convert vertex coordinates to world coordinates
    var mapToCoord = heightMap.length/2-1;

    //var vertexColorOne = new THREE.Color("rgb(151,192,86)");
    color = moviePosterColor.slice(4).substring(0, moviePosterColor.slice(4).length - 1).split(",");
    greenWeight = 3;
    newRed = Math.ceil((151*greenWeight+parseInt(color[0]))/(greenWeight+1));
    newGreen = Math.ceil((192*greenWeight+parseInt(color[1]))/(greenWeight+1));
    newBlue = Math.ceil((86*greenWeight+parseInt(color[2]))/(greenWeight+1));
    var combinedColor = new THREE.Color("rgb("+newRed+","+newGreen+","+newBlue+")");

    xVar +=mapToCoord;
    zVar +=mapToCoord;

    for(var i = 0; i < ground.geometry.faces.length; i++){

        var heightmapWidth = heightMap.length;
        
        // the vertix ID for the three points in the terrain triangles
        var vertexIdxA = ground.geometry.faces[i].a;
        var vertexIdxB = ground.geometry.faces[i].b;
        var vertexIdxC = ground.geometry.faces[i].c;

        // converting the IDs to x, y coordinates
        var xVertexA = Math.floor(vertexIdxA % heightmapWidth);
        var zVertexA = Math.floor(vertexIdxA / heightmapWidth);
        var xVertexB = Math.floor(vertexIdxB % heightmapWidth);
        var zVertexB = Math.floor(vertexIdxB / heightmapWidth);
        var xVertexC = Math.floor(vertexIdxC % heightmapWidth);
        var zVertexC = Math.floor(vertexIdxC / heightmapWidth);

        // calculating the vectors between the points of the triangle to the center of the tree
        var hypoA = Math.hypot(Math.abs(xVertexA-xVar),Math.abs(zVertexA-zVar));
        var hypoB = Math.hypot(Math.abs(xVertexB-xVar),Math.abs(zVertexB-zVar));
        var hypoC = Math.hypot(Math.abs(xVertexC-xVar),Math.abs(zVertexC-zVar));

        // if the vectors are in reach of the tree, color the ground
        if(hypoA<vertexRange) {
            ground.geometry.faces[i].vertexColors.splice(0, 1, combinedColor);
        }

        if(hypoB<vertexRange) {
            ground.geometry.faces[i].vertexColors.splice(1, 1, combinedColor);
        } 

        if(hypoC<vertexRange) {
            ground.geometry.faces[i].vertexColors.splice(2, 1, combinedColor);
        } 
    }
}





