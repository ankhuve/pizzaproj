$(function(){
/*Work on v72  */
    
    /*global variables*/
    var scene, camera, renderer;
    var controls;
    var stats;
    var spotLight, cube;
    var SCREEN_WIDTH, SCREEN_HEIGHT;


    function init(){


        /*creates empty scene object and renderer*/
        scene = new THREE.Scene();

        var Terrain_material = new THREE.MeshPhongMaterial( {
            color: 0x6c94bd,
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.FlatShading
        });

        var xS = 128, yS = 128;
        terrainScene = THREE.Terrain({
            easing: THREE.Terrain.Linear,
            frequency: 2.5,
            heightmap: THREE.Terrain.DiamondSquare,
            material: Terrain_material,
            maxHeight: 100,
            minHeight: -100,
            steps: 1,
            useBufferGeometry: false,
            xSegments: xS,
            xSize: 1024,
            ySegments: yS,
            ySize: 1024,
        });

        terrainScene.receiveShadow = true;

        // Assuming you already have your global scene
        scene.add(terrainScene);

        var geo = terrainScene.children[0].geometry;


        var BollMat = new THREE.MeshPhongMaterial( {
            color: 0xff0000,
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading,
            castShadow: true
        } );

        var BollGeo = new THREE.SphereGeometry( 5, 5, 5 );
        //var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var boll = new THREE.Mesh( BollGeo, BollMat );

        decoScene = THREE.Terrain.ScatterMeshes(geo, {
            mesh: buildTree(),
            w: xS,
            h: yS,
            spread: 0.02,
            randomness: Math.random,
        });

        decoScene.position.z +=3;
        terrainScene.add(decoScene);


        /* 
        decoScene = THREE.Terrain.ScatterMeshes(geo, {
            mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
            w: xS,
            h: yS,
            spread: 0.02,
            randomness: Math.random,
        });
        terrainScene.add(decoScene);

        */

        // Add randomly distributed foliage

        scene.fog = new THREE.FogExp2( 0xffffff, 0.0025 );
        
        camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
        renderer = new THREE.WebGLRenderer({antialias:true});

        renderer.setClearColor(0xdddddd);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        /*add controls*/
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render );

        /*adds helpers*/
        axis =  new THREE.AxisHelper(10);
        //scene.add (axis);

        grid = new THREE.GridHelper(500, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);
        //scene.add(grid);

        /*Camera*/
        camera.position.x = 30;
        camera.position.y = 30;
        camera.position.z = 30;

        scene.position.x = 0;
        scene.position.y = -100;
        scene.position.z = 0;
        camera.lookAt(scene.position);

        var light = new THREE.HemisphereLight( 0x2a3865, 0x91a3de, 1 );
        scene.add( light );

        /*Lights*/
        var ambient = new THREE.AmbientLight( 0x404040 );
        scene.add( ambient );

        var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
        pointLight.position.set( 5, 20, 5 );
        pointLight.castShadow = true;
        pointLight.shadowCameraNear = 8;
        pointLight.shadowCameraFar = 300;
        pointLight.shadowDarkness = 0.5;
        pointLight.shadowCameraVisible = false;
        pointLight.shadowMapWidth = 1024;
        pointLight.shadowMapHeight = 1024;
        scene.add( pointLight );

        var sphereSize = 1;
        var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        scene.add( pointLightHelper );

        /*Ground*/
        var Ground_geometry = new THREE.BoxGeometry( 200, 0.1, 200 );
        var Ground_material = new THREE.MeshPhongMaterial( {
            color: 0xa0adaf,
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.SmoothShading
        } );

        var ground = new THREE.Mesh( Ground_geometry, Ground_material );
        ground.scale.multiplyScalar( 5 );
        ground.castShadow = false;
        ground.receiveShadow = true;
        //scene.add( ground );

     

		//var blobGeometry = Coral.Blob( {"smoothing":2,"detail":2,"radius":2,"noiseOptions":2} );
		//var sphereBlob = new THREE.Mesh( blobGeometry, Sphere_material );
		//scene.add( sphereBlob );


        $("#holder").append(renderer.domElement);

    }

  

    function render() {
    	// DEPTH OF FIELD VILL HA DEN HÄR BITEN MEN DET FUNKAR FAN INTE. postprocessing.composer.render( 0.1 );
    }

    function animate(){
        requestAnimationFrame(animate);
        render();

        renderer.render(scene, camera);
    }

    

    init();
    animate();

    // DEPTH OF FIELD SOM INTE FUNKAR
	var postprocessing = {};
    initPostprocessing();
	
	function initPostprocessing() {
		var renderPass = new THREE.RenderPass(scene,camera);
		var params = {focus: 1.0, aperture: 0.025, maxblur: 1.0, width: window.innerWidth, height: window.innerHeight};

		var bokehPass = new THREE.BokehPass(scene,camera,params);

		bokehPass.renderToScreen = true;

		var composer = new THREE.EffectComposer( renderer );

		composer.addPass( renderPass );
		composer.addPass( bokehPass );

		postprocessing.composer = composer;
		postprocessing.bokeh = bokehPass;

	}

	// DEPTH OF FIELD KOD SLUTAR HÄR

    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });

});	


function buildTree() {
  var material = new THREE.MeshFaceMaterial([
    new THREE.MeshLambertMaterial({ color: 0x3d2817 }), // brown
    new THREE.MeshLambertMaterial({ color: 0x2d4c1e }), // green
  ]);

  var c0 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6, 1, true));
  c0.position.y = 6;
  var c1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 14, 8));
  c1.position.y = 18;
  var c2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 9, 13, 8));
  c2.position.y = 25;
  var c3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 12, 8));
  c3.position.y = 32;

  var g = new THREE.Geometry();
  c0.updateMatrix();
  c1.updateMatrix();
  c2.updateMatrix();
  c3.updateMatrix();
  g.merge(c0.geometry, c0.matrix);
  g.merge(c1.geometry, c1.matrix);
  g.merge(c2.geometry, c2.matrix);
  g.merge(c3.geometry, c3.matrix);

  var b = c0.geometry.faces.length;
  for (var i = 0, l = g.faces.length; i < l; i++) {
    g.faces[i].materialIndex = i < b ? 0 : 1;
  }

  var m = new THREE.Mesh(g, material);

  m.scale.x = m.scale.z = 5;
  m.scale.y = 1.25;
  return m;
}



