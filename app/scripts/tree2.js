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

        grid = new THREE.GridHelper(50, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);
        scene.add(grid);

        /*Camera*/
        camera.position.x = 15;
        camera.position.y = 12;
        camera.position.z = 10;
        camera.lookAt(scene.position);

        /*Lights*/
        var ambient = new THREE.AmbientLight( 0x404040 );
        scene.add( ambient );

        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 10, 10, 15 );
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 8;
        spotLight.shadowCameraFar = 30;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowCameraVisible = false;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.name = 'Spot Light';
        scene.add( spotLight );

        /*Ground*/
        var Ground_geometry = new THREE.BoxGeometry( 20, 0.1, 20 );
        var Ground_material = new THREE.MeshPhongMaterial( {
            color: 0xa0adaf,
            shininess: 150,
            specular: 0xffffff,
            shading: THREE.SmoothShading
        } );

        var ground = new THREE.Mesh( Ground_geometry, Ground_material );
        ground.scale.multiplyScalar( 3 );
        ground.castShadow = false;
        ground.receiveShadow = true;
        scene.add( ground );

        /*Box*/
        var Box_material = new THREE.MeshPhongMaterial( {
            color: 0xff0000,
            shininess: 150,
            specular: 0x222222,
            shading: THREE.SmoothShading,
        } );
        var Box_geometry = new THREE.BoxGeometry( 3, 3, 3 );
        cube = new THREE.Mesh( Box_geometry, Box_material );
        cube.position.set( 0, 1.6, 0 );
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add( cube );


        $("#holder").append(renderer.domElement);

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



