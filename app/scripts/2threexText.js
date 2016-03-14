function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;

		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;	
	
	// text color
	context.fillStyle = "rgba(255, 255, 255, 1)";

	context.fillText( message, 0, fontsize + 0);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

/* var THREEx	= THREEx	|| {}


THREEx.Text	= function(text, options){
	options	= options || {
		font		: "droid serif",
		weight		: "bold",
		size		: 1,
		height		: 0.4,
	}

	// create the tGeometry
	var geometry	= new THREE.TextGeometry(text, options)

	// center the geometry
	// - THREE.TextGeometry isnt centered for unknown reasons. all other geometries are centered
	geometry.computeBoundingBox();
	var center	= new THREE.Vector3();
	center.x	= (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2
	// center.y	= (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2
	center.z	= (geometry.boundingBox.max.z - geometry.boundingBox.min.z) / 2
	geometry.vertices.forEach(function(vertex){
		vertex.sub(center)
	})
	
	// create a mesh with it
	var material	= new THREE.MeshNormalMaterial()
	var mesh	= new THREE.Mesh(geometry, material)
	// return mesh
	return mesh
}
*/