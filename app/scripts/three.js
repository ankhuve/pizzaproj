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

        //scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );
        
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
        scene.add (axis);

        grid = new THREE.GridHelper(500, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);
        scene.add(grid);

        /*Camera*/
        camera.position.x = 30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        /*Lights*/
        var ambient = new THREE.AmbientLight( 0x404040 );
        scene.add( ambient );

/* 
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set(15, 20, 15 );
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 8;
        spotLight.shadowCameraFar = 300;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowCameraVisible = false;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.name = 'Spot Light';
        scene.add( spotLight );

        */

        var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
        pointLight.position.set( -5, 20, 5 );
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
        scene.add( ground );

        /*Box*/
        var Box_material = new THREE.MeshPhongMaterial( {
            color: 0xff0000,
            shininess: 0,
            specular: 0x222222,
            shading: THREE.SmoothShading,
        } );

        var Box_geometry = new THREE.BoxGeometry( 1, 3, 1 );
       

        cubes = new THREE.Object3D();
        scene.add( cubes );
        var range = 1;

        for(var i = 0; i < 1; i++ ) {
            var grayness = Math.random() * 0.5 + 0.25,
            mat = new THREE.MeshBasicMaterial();
            cube = new THREE.Mesh( Box_geometry, Box_material );
            cube.castShadow = true;
            cube.receiveShadow = true;
            mat.color.setRGB( grayness, grayness, grayness );
            //cube.position.set( range * (0.5 - Math.random()), 4, range * (0.5 - Math.random()) );
            cube.position.set(0,1.5,0);

            //cube.grayness = grayness; // *** NOTE THIS
            cubes.add( cube );
        }

        var Sphere_material = new THREE.MeshPhongMaterial( {
            color: 0xff0000,
            shininess: 0,
            specular: 0x222222,
            shading: THREE.FlatShading,
        } );

        var geometry = new THREE.SphereGeometry( 5, 5, 5 );
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var sphere = new THREE.Mesh( geometry, Sphere_material );
		sphere.position.set(0,7.5,0);
		scene.add( sphere );

		//var blobGeometry = Coral.Blob( {"smoothing":2,"detail":2,"radius":2,"noiseOptions":2} );
		//var sphereBlob = new THREE.Mesh( blobGeometry, Sphere_material );
		//scene.add( sphereBlob );


        $("#holder").append(renderer.domElement);

    }

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

    function render() {}

    function animate(){
        requestAnimationFrame(animate);
        render();

        renderer.render(scene, camera);
    }

    init();
    animate();

    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });

});	






