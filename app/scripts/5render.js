var prevPos = {"x":0, "y":0, "z":0};
var moviePrev = "";

function animate() {

    requestAnimationFrame( animate );

    movementAndDetailsOnDemand();

    renderer.render( scene, camera );

}