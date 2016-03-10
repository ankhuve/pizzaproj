
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

    console.log(data);

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
        //var z = -10;

        //console.log(z);
        // check for trees nearby with range and coordinates

        // var treeRange = 10;
        // for(var i = 0; i <arrayOfTreePos.length; i++) {
        //     alreadyX = arrayOfTreePos[i].x;
        //     alreadyZ = arrayOfTreePos[i].z;
        //     var checkIfTreeNearby = true;

        //     while(checkIfTreeNearby) {
        //         if((alreadyX>x-treeRange) && (alreadyX<x+treeRange) && (alreadyZ>z-treeRange) && (alreadyZ<z+treeRange)) {
        //             console.log(x, z);
        //             z = range * (0.5 - Math.random());
        //             console.log("krock");
        //         } else {

        //             checkIfTreeNearby = false;
        //         }
        //     }


        // }

        // check for trees nearby with length of vector instead (none is working)

        // for(var k = 0; k <arrayOfTreePos.length; k++) {
        //     alreadyX = arrayOfTreePos[k].x;
        //     alreadyZ = arrayOfTreePos[k].z;
        //     var treeRange = 10;
        //     var checkIfTreeNearby = true;

        //     xLength = Math.abs(alreadyX-x);
        //     zLength = Math.abs(alreadyZ-z);

        //     var hypo = Math.hypot(xLength,zLength);

        //     hypo = Math.ceil(hypo);

        //     while(checkIfTreeNearby) {

        //         zLength = Math.abs(alreadyZ-z);
        //         hypo = Math.hypot(xLength,zLength);
        //         hypo = Math.ceil(hypo);

        //             if(hypo<treeRange) {
        //                 z = range * (0.5 - Math.random());
     
        //                 //k = 0;
        //                 //console.log(arrayOfTreePos[i].data[0], " krock ", x, z, alreadyX, alreadyZ);
        //                 //console.log(arrayOfTreePos[i].data[0], hypo);
        //             } else {
        //                 //console.log(arrayOfTreePos[k].data[0], hypo, data[i][0]);
        //                 //console.log("x old", alreadyX, "z old", alreadyZ, "x nya", x, "z nya", z);
        //                 checkIfTreeNearby = false;
        //             }
                
        //     }

        // }

        //console.log(z);
        //console.log("-");
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
        colorGround(x,z);

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

    //console.log(arrayOfTreePos);

        // for(var i = 0; i <arrayOfTreePos.length; i++) {
        //     alreadyX = arrayOfTreePos[i].x;
        //     alreadyZ = arrayOfTreePos[i].z;
        //     var numbColl = 0;
        //     var treeRange = 10;

        //     for(var j = 0; j <arrayOfTreePos.length; j++) {
        //         alreadyXinner = arrayOfTreePos[j].x;
        //         alreadyZinner = arrayOfTreePos[j].z;
        //         if((alreadyX>alreadyXinner-treeRange) && (alreadyX<alreadyXinner+treeRange) && (alreadyZ>alreadyZinner-treeRange) && (alreadyZ<alreadyZinner+treeRange)) {
        //             console.log(numbColl);
        //             numbColl++;
        //         } 
        //     }
        // }







    scene.add( trees );

    // now that we changed the color of vertices, add ground
    scene.add( ground );

}

function colorGround(xVar, zVar) {
    //console.log("-");

    var vertexRange = 2;
    var mapToCoord = heightMap.length/2-1;
    var vertexColor = new THREE.Color("rgb(255,0,0)")
    //var xVar = 0;
    //var zVar = 0;

    //console.log(xVar, zVar);

    addX = 1;

    addZ = -zVar/(heightMap.length*2);

    xVar +=mapToCoord;
    zVar +=mapToCoord;
    xVar = xVar+addX;
    zVar = zVar+addZ;

    for(var i = 0; i < ground.geometry.faces.length; i++){
        var vertexIdxA = ground.geometry.faces[i].a;
        var vertexIdxA = ground.geometry.faces[i].b;
        var vertexIdxA = ground.geometry.faces[i].c;
        var heightmapWidth = heightMap.length;
        var xVertexA = Math.floor(vertexIdxA % heightmapWidth);
        var zVertexA = Math.floor(vertexIdxA / heightmapWidth);

        var xVertexB = Math.floor(vertexIdxA % heightmapWidth);
        var zVertexB = Math.floor(vertexIdxA / heightmapWidth);

        var xVertexC = Math.floor(vertexIdxA % heightmapWidth);
        var zVertexC = Math.floor(vertexIdxA / heightmapWidth);

        if((xVertexA>xVar-vertexRange) && (xVertexA<xVar+vertexRange) && (zVertexA>zVar-vertexRange) && (zVertexA<zVar+vertexRange)) {

            ground.geometry.faces[i].vertexColors = [];
            ground.geometry.faces[i].vertexColors.push(vertexColor);
            ground.geometry.faces[i].vertexColors.push(vertexColor);
            ground.geometry.faces[i].vertexColors.push(vertexColor);

            //console.log(ground.geometry.faces[i]);
            //console.log(xVertexA,zVertexA,xVertexB,zVertexB,xVertexC,zVertexC);
            //console.log(ground.geometry.faces[i]);

        }
    }

}






