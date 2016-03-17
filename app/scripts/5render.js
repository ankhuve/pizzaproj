var prevPos = {
    "x": 0,
    "y": 0,
    "z": 0
};
var moviePrev = "";
/*
function renderBirds(){


    //birds
    for ( var i = 0, il = birds.length; i < il; i++ ) {

        boid = boids[ i ];
        boid.run( boids );

        musicIndicatorMesh = birds[ i ];
        musicIndicatorMesh.position.copy( boids[ i ].position );

        color = musicIndicatorMesh.material.color;
        color.r = color.g = color.b = ( 500 - musicIndicatorMesh.position.z ) / 1000;

        musicIndicatorMesh.rotation.y = Math.atan2( - musicIndicatorMesh.velocity.z, musicIndicatorMesh.velocity.x );
        musicIndicatorMesh.rotation.z = Math.asin( musicIndicatorMesh.velocity.y / musicIndicatorMesh.velocity.length() );

        musicIndicatorMesh.phase = ( musicIndicatorMesh.phase + ( Math.max( 0, musicIndicatorMesh.rotation.z ) + 0.1 )  ) % 62.83;
        musicIndicatorMesh.geometry.vertices[ 5 ].y = musicIndicatorMesh.geometry.vertices[ 4 ].y = Math.sin( musicIndicatorMesh.phase ) * 5;

    }


}
*/
 var t = 0;
function animate() {

    requestAnimationFrame(animate);

    var w = window.innerWidth,
        h = window.innerHeight;

    if (!controls.enabled) {
        controls.getObject().rotation.y -= Math.PI / 5000;
    }

    //mapCamera.rotation.z = controls.getObject().rotation.y;

    //cloudObj.position.x +=Math.PI/50;
    //circle.position.x = controls.getObject().position.x;
    triangle.position.set(controls.getObject().position.x, controls.getObject().position.y + 10, controls.getObject().position.z)
    triangle.rotation.x = -Math.PI / 2;
    triangle.rotation.z = (controls.getObject().rotation.y) - 44.91;

    triangle2.position.set(controls.getObject().position.x, controls.getObject().position.y + 10, controls.getObject().position.z)
    triangle2.rotation.x = -Math.PI / 2;
    triangle2.rotation.z = (controls.getObject().rotation.y) - 44.91;
    //console.log(circle.position.x);
/*
    //birds
    for ( var i = 0, il = birds.length; i < il; i++ ) {

        boid = boids[ i ];
        boid.run( boids );

        bird = birds[ i ];
        bird.position.copy( boids[ i ].position );

        color = bird.material.color;
        color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

        bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
        bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

        bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
        bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

    }

*/
    t += 0.01;

    //console.log('Fisgrej' + indicatorPositionX[5]);

    //musicIndicatorMesh.position.x = indicatorPositionX[5] + 20*Math.cos(t);
    //musicIndicatorMesh.position.z = indicatorPositionZ[5] + 20*Math.sin(t);
    movementAndDetailsOnDemand();


    // setViewport parameters:
    renderer.setViewport(0, 0, w, h);
    renderer.clear();

    // Depth of Field
    //depthOfField= new THREEx.DepthOfField(renderer)
    //depthOfField.render(scene, camera)

    // full display

    renderer.render(scene, camera);

    // minimap (overhead orthogonal camera)
    //  lower_left_x, lower_left_y, viewport_width, viewport_height
    renderer.setViewport(0, h - mapHeight, mapWidth, mapHeight);
    renderer.render(sceneMiniMap, mapCamera);


}