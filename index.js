
$(window).ready(function() {
    //temp();
    //initialize();
    imageType();
});

function imageType() {
    var imageTypeOptions = {
	getTileUrl: function(coord, zoom) {
	    var normalizedCoord = getNormalizedCoord(coord, zoom);
	    if(!normalizedCoord) {
		return null;
	    }

	    var bound = Math.pow(2, zoom);
	    //var base = "http://66.92.65.8:8080/palimpsest/imgs/";
	    //return base + "${zoom}/$
	    return "http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw/" + zoom + "/" + normalizedCoord.x + "/" + (bound - normalizedCoord.y - 1) + ".jpg";
	},
	tileSize: new google.maps.Size(256, 256),
	maxZoom: 9,
	minZoom: 0,
	radius: 1738000,
	name: "Moon"
    };

    var moonMapType = new google.maps.ImageMapType(imageTypeOptions);

    var myLatlng = new google.maps.LatLng(0,0);
    var mapOptions = {
	center: myLatlng,
	zoom: 1,
	streetViewControl: false,
	mapTypeControlOptions: {
	    mapTypeIds: ["moon"]
	}
    };

    var map = new google.maps.Map(document.getElementById("gmaps_container"), mapOptions);
    map.mapTypes.set('moon', moonMapType);
    map.setMapTypeId('moon');
}

function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    var tileRange = 1 << zoom;
    if (y < 0 || y >= tileRange) {
	return null;
    }

    if (x < 0 || x >= tileRange) {
	x = (x % tileRange + tileRange) % tileRange;
    }

    return { 
	x: x,
	y: y
    };
}

var ARCHEMEDES_MAP_TYPE = 'archemedes';

function temp() {

    var options = {
	/*mapTypeControlOptions: {
	    mapTypeIds: [ARCHEMEDES_MAP_TYPE]
	},
	mapTypeId: ARCHEMEDES_MAP_TYPE,*/
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	zoom: 1,
	center: new google.maps.LatLng(0.0, 0.0)
    };
    var map = new google.maps.Map(document.getElementById("gmaps_container"), options);
}

function initialize() {
    map = new GMaps({
	div: '#gmaps_container',
	lat: -12.04,
	lng: -77.02
    });
}
