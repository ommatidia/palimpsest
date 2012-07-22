var ARCHEMEDES_MAP_TYPE = 'archemedes';
var GALEN_MAP_TYPE = 'galen';

function getMapTypeControlOptions() {
    return {
	mapTypeIds: [ARCHEMEDES_MAP_TYPE, GALEN_MAP_TYPE]
    };
}

function setMap(gmap, type) {
    if(type == ARCHEMEDES_MAP_TYPE) {
	var maptype = new archemedesMapType();
	gmap.mapTypes.set(ARCHEMEDES_MAP_TYPE, maptype);
    } else if(type == GALEN_MAP_TYPE) {
	var maptype = new galenMapType();
	gmap.mapTypes.set(GALEN_MAP_TYPE, maptype);
    } else {
	console.log("Attempted to set an invalid map type: " + type);
    }

}

function archemedesMapType() {
}
//prototype interface impl

function galenMapType() {
}
//prototype interface impl

