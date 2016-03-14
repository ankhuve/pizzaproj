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
        colorGround(x,z,y);

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

    //console.log(trees);


    // for(var i = 0 ; i <arrayOfTreePos.length; i++) {
    //     //console.log(arrayOfTreePos[i]);
    //     var constCheck = true;

    //     while(constCheck) {
    //         var collisionNumb = 0;
    //         for(var j = 0; j <arrayOfTreePos.length; j++) {
    //             if(arrayOfTreePos[j].data[0]!=arrayOfTreePos[i].data[0]){
    //                 var outerTreeX = arrayOfTreePos[i].x;
    //                 var outerTreeZ = arrayOfTreePos[i].z;
    //                 var innerTreeX = arrayOfTreePos[j].x;
    //                 var innerTreeZ = arrayOfTreePos[j].z;
    //                 var hypo = Math.hypot(Math.abs(outerTreeX-innerTreeX),Math.abs(outerTreeZ-innerTreeZ));
    //                 if(hypo<10) {
    //                     console.log(hypo);
    //                     arrayOfTreePos[i].z += 1;
    //                     collisionNumb++;
    //                 }
    //             }
    //         }

    //         if(collisionNumb==0) {
    //             constCheck = false;
    //         }
            
    //     }

    // }

    //console.log(arrayOfTreePos);

        // for(var i = 0; i <arrayOfTreePos.length; i++) {
        //     alreadyX = arrayOfTreePos[i].x;
        //     alreadyZ = arrayOfTreePos[i].z;
        //     var numbColl = 0;
        //     var treeRange = 3;

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
    sceneMiniMap.add( trees.clone() ); 

    // now that we changed the color of vertices, add ground
    scene.add( ground );

}

function colorGround(xVar, zVar, yVar) {
    //console.log("-");

    var vertexRange = 2;
    var mapToCoord = heightMap.length/2-1;
    //var vertexColorOne = new THREE.Color("rgb(255,0,0)");
    var vertexColorOne = new THREE.Color("rgb(151,192,86)");
    var vertexColorTwo = new THREE.Color("rgb(0,255,0)");
    var vertexColorThree = new THREE.Color("rgb(0,0,255)");
    var vertexColorGround = new THREE.Color("rgb(171,212,106)")
    //var xVar = 0;
    //var zVar = 0;

    //console.log(xVar, zVar);

    addX = 0;

    addZ = 0;

    xVar +=mapToCoord;
    zVar +=mapToCoord;
    xVar = xVar+addX;
    zVar = zVar+addZ;

    for(var i = 0; i < ground.geometry.faces.length; i++){

        var heightmapWidth = heightMap.length;
        
        var vertexIdxA = ground.geometry.faces[i].a;
        var vertexIdxB = ground.geometry.faces[i].b;
        var vertexIdxC = ground.geometry.faces[i].c;

        var xVertexA = Math.floor(vertexIdxA % heightmapWidth);
        var zVertexA = Math.floor(vertexIdxA / heightmapWidth);
        var xVertexB = Math.floor(vertexIdxB % heightmapWidth);
        var zVertexB = Math.floor(vertexIdxB / heightmapWidth);
        var xVertexC = Math.floor(vertexIdxC % heightmapWidth);
        var zVertexC = Math.floor(vertexIdxC / heightmapWidth);

        var hypoA = Math.hypot(Math.abs(xVertexA-xVar),Math.abs(zVertexA-zVar));
        var hypoB = Math.hypot(Math.abs(xVertexB-xVar),Math.abs(zVertexB-zVar));
        var hypoC = Math.hypot(Math.abs(xVertexC-xVar),Math.abs(zVertexC-zVar));
        
        var hypoArr = [hypoA, hypoB, hypoC];
        var hypoArrLeft = [hypoA, hypoB, hypoC];

        var minHypo = Math.min(hypoA,hypoB,hypoC);
        var maxHypo = Math.max(hypoA,hypoB,hypoC);

        var minHypoIndex = hypoArr.indexOf(minHypo);
        var maxHypoIndex = hypoArr.indexOf(maxHypo);

        hypoArr.splice(minHypoIndex, 1)
        hypoArr.splice(maxHypoIndex, 1)

        var leftHypo = hypoArr[0];

        var leftHypoIndex = hypoArrLeft.indexOf(leftHypo);

        if(minHypo<vertexRange) {
            ground.geometry.faces[i].vertexColors.splice(minHypoIndex, 1, vertexColorOne);
        }

        if(maxHypo<vertexRange) {
            ground.geometry.faces[i].vertexColors.splice(maxHypoIndex, 1, vertexColorOne);
        } 

        if(leftHypo<vertexRange) {
            ground.geometry.faces[i].vertexColors.splice(leftHypoIndex, 1, vertexColorOne);
        } 

        //ground.geometry.faces[i].vertexColors.splice(2, 1, vertexColorOne);
        

    }
}

// function colorGround(xVar, zVar) {
//     var vertexRange = 2;
//     var mapToCoord = heightMap.length/2-1;
//     var vertexColor = new THREE.Color("rgb(255,0,0)")

//     addX = 1;
//     addZ = -zVar/(heightMap.length*2);
//     xVar +=mapToCoord;
//     zVar +=mapToCoord;
//     xVar = xVar+addX;
//     zVar = zVar+addZ;

//     for(var i = 0; i < ground.geometry.faces.length; i++){

//         //var vertexIdxA = ground.geometry.faces[i].a;
//         //var vertexIdxA = ground.geometry.faces[i].b;
//         var vertexIdxC = ground.geometry.faces[i].c;
//         var heightmapWidth = heightMap.length;

//         // var xVertexA = Math.floor(vertexIdxA % heightmapWidth);
//         // var zVertexA = Math.floor(vertexIdxA / heightmapWidth);
//         // var xVertexB = Math.floor(vertexIdxA % heightmapWidth);
//         // var zVertexB = Math.floor(vertexIdxA / heightmapWidth);
//         var xVertexC = Math.floor(vertexIdxC % heightmapWidth);
//         var zVertexC = Math.floor(vertexIdxC / heightmapWidth);

//         if((xVertexC>xVar-vertexRange) && (xVertexC<xVar+vertexRange) && (zVertexC>zVar-vertexRange) && (zVertexC<zVar+vertexRange)) {
//             ground.geometry.faces[i].vertexColors = [];
//             ground.geometry.faces[i].vertexColors.push(vertexColor);
//             ground.geometry.faces[i].vertexColors.push(vertexColor);
//             ground.geometry.faces[i].vertexColors.push(vertexColor);
//         }
//     }
// }






