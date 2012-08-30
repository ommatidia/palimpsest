$(window).ready(function() {
    console.log("ready");
});

$(window).load(function() {
    console.log("begin load");
    registerListeners();
    
    resize();
    $(window).bind("resize", resize);
    initializeGMaps();

    initializeTranscription();

    initializeThumbScroller();
    resize();
    console.log("end load");
});

function initializeThumbScroller() {
    function createThumbnailLink(pageId, pageNum) {
        img = $('<img/>', {
	    'src': 'tiles/{id}/1/level_0/0_0.png'.replace(/{id}/g, pageId),
	    'title': pages[pageId]['1'],
	    'alt': 'Page ' + pageNum
	});
        
        anchor = $('<a/>', { 'href': '#' });
        anchor.bind('click', function() {
            currentPage(pageId, "1");
        });
        anchor.append(img);
        return anchor;
    }

    var num = 1;
    for(key in pages) {
        x = createThumbnailLink(key, num++);
	$('.jTscroller').append(x);
    }
    $('#ts2_container').thumbnailScroller(getThumbScrollerOptions());
};

function getThumbScrollerOptions() {
    return {
	noScrollCenterSpace: 400,
        scrollerType: 'clickButtons',
        acceleration: 2,
        scrollSpeed: 800
    };
}


function initializeTranscription() {
    //TODO: remove this cruft
    $('.rpanel').append(document.createTextNode("TODO: Line/Page numbered Greek Transcriptions"));
    for(var j = 0; j < 3; j++) {    
	$('.rpanel').append(document.createElement("br"));
    }
    
    for(var i = 0; i < 4; i++) {
	$('.rpanel').append(document.createTextNode("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."));
    }


}

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
	//TODO: ensure valid
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
	window.innerHeight-$('.menubar').outerHeight(true)-$('#ts2_container').outerHeight(true)-margins
    );

    margins = body.outerWidth(true) - body.width();
    $('.jThumbnailScroller').width(window.innerWidth-margins-10);
    $('.rpanel').height($('#gmaps_container').height());

    
    $('#gmaps_container').width(
	window.innerWidth-$('.rpanel').outerWidth(true)-margins-4
    );

    
}

function reloadTiles() {
    /*
     * Image should already be cached for the thumbnail scroller.
     * 
     */
	
    var mapTypeId = 'palimpsest';

    getNotificationDiv(); //make sure the event listener is loaded;
    
    var img = new Image();
    img.onload = function() {
	var map = getMap();
	map.mapTypes.set(mapTypeId, getImageMapType(this.width , this.height))
	map.setMapTypeId(mapTypeId);	
	fireReloaded();
    };
    img.src = getTileUrl(0, 0, 0);
}

function getTileUrl(level, x, y) {
    if(!HACKITY_HACKITY_HACK_MCHACK) {
	var current = currentPage();
	var image = current['page'];
	var layer = current['view'];
	var url = "/palimpsest/tiles/%{image}/%{layer}/level_%{level}/%{x}_%{y}.png";
	url = url.replace(/%{image}/g, image).replace(/%{layer}/g, layer).replace(/%{level}/g, level);
	return url.replace(/%{x}/g, x).replace(/%{y}/g, y);
    } else {
	return "/galen_tiles/level_%{level}/%{x}_%{y}.png".replace(/%{level}/g, level).replace(/%{x}/g, x).replace(/%{y}/g, y);
    }
}

function fireReloaded() {
    var evt = document.createEvent("Event");
    evt.initEvent("reloaded", true, true);
    document.dispatchEvent(evt);
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

function getImageMapType(tw, th) {
    var options = typeOptions;
    options['tileSize'] = new google.maps.Size(tw, th);
    return new google.maps.ImageMapType(options);
}

var HACKITY_HACKITY_HACK_MCHACK = false;
var typeOptions = {
    getTileUrl: function(coord, zoom) {
	var normalizedCoord = getNormalizedCoord(coord, zoom);
	if(!normalizedCoord) {
	    return null;
	}

	return getTileUrl(zoom, normalizedCoord.x, normalizedCoord.y);
	/*if(HACKITY_HACKITY_HACK_MCHACK == true) {
	    return "/galen_tiles/level_%{zoom}/%{x}_%{y}.png".replace(/%{zoom}/g, zoom).replace(/%{x}/g, normalizedCoord.x).replace(/%{y}/g, (normalizedCoord.y));
	} else if(HACKITY_HACKITY_HACK_MCHACK == false) {
	    return "/palimpsest/tiles/" + getImage() + "/level_%{zoom}/%{x}_%{y}.png".replace(/%{zoom}/g, zoom).replace(/%{x}/g, normalizedCoord.x).replace(/%{y}/g, (normalizedCoord.y));
	} else {
	    return HACKITY_HACKITY_HACK_MCHACK;
	}*/
    },
    maxZoom: 5,
    minZoom: 0,
    radius: 10,
    name: "Archimedes Palimpsest"
};

function getGMapsOptions() {
    var mapOptions = {
	center: new google.maps.LatLng(0, 0),
	zoom: 1,
	backgroundColor: '#000000',
	streetViewControl: false,
	mapTypeControlOptions: {
	    mapTypeIds: ["palimpsest"]
	}
    };
    return mapOptions;
}

function initializeGMaps() {
    var map = this.getMap();
}

function getNotificationDiv() {
    if(!this.div) {
	this.div = document.createElement('div');
	this.div.id = 'notify';
	this.div.style.fontSize = '12px';
	this.div.style.whiteSpace = 'nowrap';
	this.div.style.align = 'center';
	this.div.style.backgroundColor = '#666666';
	this.div.style.color = '#ffffff';
	this.div.style.padding = '1px 5px 1px 5px';
	this.div.index = 0;
	this.div.appendChild(document.createTextNode("Hello"));
	
	var div = this.div; //closure to update content immediately
	document.addEventListener("reloaded", function(evt) {
	    var page = currentPage()['page'];
	    var view = currentPage()['view'];
	    div.textContent = pages[page][view];
	}, true);
    }
    return this.div;
}

function getMap() {
    if(!this.map) {
	var mapOptions = getGMapsOptions();
	
	this.map = new google.maps.Map($('#gmaps_container')[0], mapOptions);
	
	this.map.controls[google.maps.ControlPosition.BOTTOM].push(getNotificationDiv());

	this.reloadTiles(); //setMapId


	google.maps.event.addListener(this.map, 'center_changed', function() {checkBounds();});
    }
   return this.map;
}

function getMapType() {
    var map = getMap();
    if(!map) return null;
    
    var currentMapType = map.mapTypes.get(map.getMapTypeId);
    return currentMapType;
}

function getScreenBounds() {
    //TODO: restrict image to stay on screen
    var w = $('#gmaps_container').width();
    var h = $('#gmaps_container').height();
    var z = getMap().getZoom();
    
    var mapType = getMapType();
    var tileSize = null;
    if(mapType && $.isFunction(mapType.tileSize)) {
	tileSize = mapType.tileSize();
    } else {
	tileSize = new google.maps.Size(128, 171);
    }

    return null;
}

function checkBounds() {
    //TODO: restrict image to stay on screen
    var center = getMap().getCenter();
    var x = center.lng();
    var y = center.lat();
    //console.log('x = ', x, ', y = ', y);
    getScreenBounds();
    /*var mapType = getMapType();
    var tileSize = null;
    if(mapType && $.isFunction(mapType.tileSize)) {
	tileSize = mapType.tileSize();
    } else {
	tileSize = new google.maps.Size(128, 171);
    }

    var allowedBounds = new google.maps.LatLngBounds();
    var center = getMap().getCenter();
    if(!allowedBounds.contains(center)) {
	
	
	


	var maxx = allowedBounds.getNorthEast().lng();
	var maxy = allowedBounds.getNorthEast().lat();
	var minx = allowedBounds.getSouthWest().lng();
	var miny = allowedBounds.getSouthWest().lat();
	if(x < minx) x = minx;
	else if(x > maxx) x = maxx;
	if(y < miny) y = miny;
	else if(y > maxy) y = maxy;
	
	getMap().setCenter(new google.maps.LatLng(y, x));
    }*/
}

function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    var tileRange = 1 << zoom;
    if (y < 0 || y >= tileRange) {
	return null;
    }

    if (x < 0 || x >= tileRange) {
	//x = (x % tileRange + tileRange) % tileRange;
	return null;
    }

    return { 
	x: x,
	y: y
    };
}



