$(window).ready(function() {
    registerListeners();
    
    resize();
    $(window).bind("resize", resize);
    imageType();
});


function registerListeners() {
    
    $('#prev').bind('click', function(evt) {
	var current = currentPage();
	var p = current['page'];
	var v = current['view'];
	if(v == "1") {
	    var p = pages[p]['_prev'];
	    if(!p) {
		return;
	    }
	    
	    v = pages[p]['_length'];
	} else {
	    v = ""+(Number(view)-1)
	}
	currentPage(p, v);
    });

    $('#next').bind('click', function(evt) {
	var current = currentPage();
	var p = current['page'];
	var v = current['view'];
	if(v == pages[p]['_length']) {
	    v = "1";
	    p = pages[p]['_next']
	    if(!p) {
		return;
	    }
	} else {
	    v = ""+(Number(v) + 1);
	}
	currentPage(p, v);
    });

    $('#ppage').bind('click', function(evt) {
	prevPage();
    });

    $('#npage').bind('click', function(evt) {
	nextPage();
    });
}

function prevPage() {
    var current = currentPage();
    var page = current['page']
    var prev = pages[page]['_prev'];
    if(prev) {
	currentPage(prev, "1");
    }
}

function nextPage() {
    var current = currentPage();
    var page = current['page'];
    var next = pages[page]['_next'];
    if(next) {
	currentPage(next, "1");
    }
}

function currentPage(page, view) {
    if(page && view) {
	//ensure valid
	this.page = page;
	this.view = view;
	loadPage(this.page, this.view);
    }

    if(!this.page) {
	this.page = "0000-088v";
    }
    if(!this.view) {
	this.view = "1";
    }

    return {
	'page': this.page,
	'view': this.view
    };
	
}


function resize() {
    var body = $('body');
    var margins = body.outerHeight(true) - body.height();
    $('#gmaps_container').height(
	window.innerHeight-$('.menubar').outerHeight(true)-margins
    );
}

function getMapTypeIds() {
    return [
	'palimpsest',
	'palimpsest2'
    ]
}

function reloadTiles() {
    if(!this.current) {
	this.current = 0;
    }
    this.current = (this.current + 1) % 2;
    var id = getMapTypeIds()[this.current];
    if(getMap().mapTypes.hasOwnProperty(id)) {
	getMap().setMapTypeId(id);
    }
}


function getImage(image) {
    if(image) {
	this.image = image;
    }
    if(!this.image) {
	var page = this.currentPage();
	this.image = page['page'] + "/" + page['view'];
    }
    return this.image;
}

function loadPage(page, view) {
    getImage(page + "/" + view);
    reloadTiles();
}


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
	    //return "http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw/" + zoom + "/" + normalizedCoord.x + "/" + (bound - normalizedCoord.y - 1) + ".jpg";
	    
	    return "http://66.92.65.8:8080/palimpsest/tiles/" + getImage() + "/level_%{zoom}/%{x}_%{y}.png".replace(/%{zoom}/g, zoom).replace(/%{x}/g, normalizedCoord.x).replace(/%{y}/g, (normalizedCoord.y));
	},
	tileSize: new google.maps.Size(128, 171),
	maxZoom: 5,
	minZoom: 0,
	radius: 10,
	name: "Archimedes Palimpsest"
    };

    var moonMapType = new google.maps.ImageMapType(imageTypeOptions);
    var altMapType = new google.maps.ImageMapType(imageTypeOptions);

    var myLatlng = new google.maps.LatLng(0,0);
    var mapOptions = {
	center: myLatlng,
	zoom: 1,
	streetViewControl: false,
	mapTypeControlOptions: {
	    mapTypeIds: ["palimpsest"]
	}
    };

    this.getMap(mapOptions, moonMapType, altMapType);
}

function getMap(mapOptions, moonMapType, altMapType) {
    if(!this.map) {
	this.map = new google.maps.Map(document.getElementById("gmaps_container"), mapOptions);
	this.map.mapTypes.set('palimpsest', moonMapType);
	this.map.mapTypes.set('palimpsest2', altMapType);
	this.reloadTiles(); //setMapId
    }
   return this.map;
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



