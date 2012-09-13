
if(!$.isFunction(Function.prototype.createDelegate)) {
    Function.prototype.createDelegate = function(scope) {
	var fn = this;
	return function() {
	    fn.apply(scope, arguments);
	}
    };
}

//TODO: multiple css files palimpsest.css, styles.css
//TODO: integrate ordering into init

/**/
var palimpsest = (function() {

    function defaultResize() {
	//DO NOTHING
    }

    /**/
    function getImageMapType(tw, th) {
	var local = options['maptype']; //options.maptype; 
	local['tileSize'] = new google.maps.Size(tw, th);
	return new google.maps.ImageMapType(local);
    }
    
    var options = {
	/**/
	init_options : {
	    'mapDiv'   : 'gmaps_container',
	    'thumbDiv' : null,
	    'protocol' : 'http',
	    'host'     : 'localhost',
	    'path'     : 'tiles',
	    'metadata' : {},
	    'order'    : [],
	    'resize'   : defaultResize,
	    'maxZoom'  : 4,
	    'minZoom'  : 0,
	    'title'    : "Palimpsest"
	    
	},
	
	/**/
	thumbscroller : {
	    noScrollCenterSpace: 400,
            scrollerType: 'clickButtons',
            acceleration: 2,
            scrollSpeed: 800
	},
	/**/
	maptype: {
	    getTileUrl: function(coord, zoom) {
		var normalizedCoord = _lib.getNormalizedCoord(coord, zoom);
		if(!normalizedCoord) {
		    return null;
		}
		
		var current = _lib.currentPage();
		var image = current['page'];
		var layer = current['view'];
		return palimpsest.getTileUrl(image, layer, zoom, normalizedCoord.x, normalizedCoord.y);
	    },
	    maxZoom: "SET IN INIT",
	    minZoom: "SET IN INIT",
	    radius: 10,
	    name: "SET IN INIT"
	},
	/**/
	map: {
	    center: new google.maps.LatLng(0, 0),
	    zoom: 1,
	    backgroundColor: '#000000',
	    streetViewControl: false,
	    mapTypeControlOptions: {
		mapTypeIds: ["palimpsest"]
	    }
	}
    };
    
    /**/
    var Library = function() {
	console.log("Library Constructor");
    };

    Library.prototype.setMetadata = function(metadata) {
	this.meta = metadata;
    };

    /**/
    Library.prototype.setThumbDivSel = function(selector) {
	if(this.thumbDivId) {
	    return; //for now only set once
	}
	this.thumbDivSel = selector;

	$(selector).addClass('jThumbnailScroller');

	var container = $('<div/>', {
	    class: ['jTscrollerContainer']
	});
	container.append($('<div/>', {
	    class: ['jTscroller']
	}));
	
	$(selector).append(container);
	/*
	$(selector).append($('<a/>', {
	    href: '#',
	    class: ['jTscrollerPrevButton']
	}));
	$(selector).append($('<a/>', {
	    href: '#',
	    class: ['jTscrollerNextButton']
	}));*/

    };
    Library.prototype.getThumbDivSel = function() {
	//TODO: error handling?
	return this.thumbDivSel;
    };

    /**/
    Library.prototype.setMapDivSel = function(selector) {
	this.mapDivSel = selector;
    };
    Library.prototype.getMapDivSel = function() {
	if(!this.mapDivSel) {
	    this.mapDivSel = '#gmaps_container';
	}
	return this.mapDivSel;
    };

    /*************************************
     * TODO: outer dimensions ie bug fix *
     *************************************/

    Library.prototype.mapWidth = function(width) {
	var sel = this.getMapDivSel();
	if(width) {
	    $(sel).width(width);
	}
	return $(sel).width()
    };
    Library.prototype.mapOuterWidth = function(flag) {
	flag = flag || true;
	return $(this.getMapDivSel()).outerHeight(flag);
    };
    Library.prototype.mapHeight = function(height) {
	var sel = this.getMapDivSel();
	if(height) {
	    $(sel).height(height);
	}
	return $(sel).height();
    };
    Library.prototype.mapOuterHeight = function(flag) {
	flag || true;
	return $(this.getMapDivSel()).outerWidth(flag);
    };

    Library.prototype.thumbWidth = function(width) {
	var sel = this.getThumbDivSel();
	if(width) {
	    $(sel).width(width);
	}
	return $(sel).width();
    };
    Library.prototype.thumbOuterWidth = function(flag) {
	flag = flag || true;
	return $(this.getThumbDivSel()).outerWidth(flag);
    };
    Library.prototype.thumbHeight = function(height) {
	var sel = this.getThumbDivSel();
	if(height) {
	    $(sel).height(height);
	}
	return $(sel).height();
    };
    Library.prototype.thumbOuterHeight = function(flag) {
	flag = flag || true;
	return $(this.getThumbDivSel()).outerHeight(flag);
    };

    /**************************
     * Image Hosting Location *
     **************************/

    Library.prototype.setProtocol = function(protocol) {
	if(protocol) {
	    this.protocol = protocol;
	} 
	return this;
    };
    Library.prototype.getProtocol = function() {
	return this.protocol;
    };

    Library.prototype.setHost = function(host) {
	if(host) {
	    this.host = host;
	} 
	return this;
    };
    Library.prototype.getHost = function() {
	return this.host;
    };

    Library.prototype.setPath = function(path) {
	if(path) {
	    this.path = path;
	} 
	return this;
    };
    Library.prototype.getPath = function() {
	return this.path;
    };

    Library.prototype.getBase = function() {
	return this.getProtocol() + "://" + this.getHost() + "/" + this.getPath();
    };

    /**********************
     * Tile URL functions *
     **********************/

    Library.prototype.getTileUrl = function(image, layer, level, x, y) {
	var fn = this.getTileUrlFn();
	return fn.call(this, image, layer, level, x, y);
    };
    Library.prototype.setTileUrlFn = function(fn) {
	this.tileFn = fn;
    };
    Library.prototype.getTileUrlFn = function() {
	if(!this.tileFn) {
	    this.tileFn = function(image, layer, level, x, y) {
		var hash = this.meta[image][parseInt(layer)]['hash']
		var url = this.getBase() + "/%{hash}/level_%{level}/%{x}_%{y}.png";
		url = url.replace(/%{hash}/g, hash).replace(/%{level}/g, level);
		return url.replace(/%{x}/g, x).replace(/%{y}/g, y);	
	    }
	}
	return this.tileFn;
    };

    /**************************
     * Internal Event Helpers *
     **************************/

    Library.prototype.fireReloaded = function() {
	var evt = document.createEvent("Event");
	evt.initEvent("reloaded", true, true);
	document.dispatchEvent(evt);
    };
    Library.prototype.fireNewFolio = function(page) {
	var evt = document.createEvent("Event");
	evt.initEvent("newFolio", true, true);
	evt.page = page;
	document.dispatchEvent(evt);
    };

    /**/
    
    Library.prototype.getNormalizedCoord = function(coord, zoom) {
	var tileRange = 1 << zoom;
	if (coord.y < 0 || coord.y >= tileRange) {
	    return null;
	}
	
	if (coord.x < 0 || coord.x >= tileRange) {
	    return null;
	}
	
	return coord;
    };
    
    /***/

    Library.prototype.getMap = function() {
	if(!this.map) {
	    var mapOptions = options.map; 
	
	    this.map = new google.maps.Map($(this.getMapDivSel())[0], mapOptions);
	
	    this.map.controls[google.maps.ControlPosition.BOTTOM].push(this.getNotificationDiv());

	    palimpsest.reloadTiles(); //setMapId

	    //TODO: bounds checking
	    //google.maps.event.addListener(this.map, 'center_changed', function() {checkBounds();});
	}
	return this.map;
    };

    /* mk private? expose position, and text?*/
    Library.prototype.getNotificationDiv = function() {
	if(!this.div) {
	    this.div = document.createElement('div');
	    this.div.id = 'notify';
	    $(this.div).addClass('mapsnotify');
	    //$(this.div).text("TEST");
	
	    document.addEventListener("reloaded", function(evt) {
		var current = this.currentPage(),
		page = current['page'],
		view = current['view'];
		this.div.textContent = this.meta[page][view]['imagename'];
	    }.createDelegate(this), true);
	}
	return this.div;
    };

    Library.prototype.reloadTiles = function() {
	//return if not init'd
	var mapTypeId = 'palimpsest';
	
	var img = new Image();
	img.onload = function() {
	    var map = this.getMap();
	    map.mapTypes.set(mapTypeId, getImageMapType(img.width , img.height))
	    map.setMapTypeId(mapTypeId);	
	    palimpsest.fireReloaded();
	}.createDelegate(this);
	var current = this.currentPage();
	img.src = this.getTileUrl(current['page'], current['view'], 0, 0, 0);
    };

    /**
     * Options that have already been set by explicit calls will not be 
     * updated by init_options.
     **/
    
    Library.prototype.init = function(init_options) {
	console.log("Initializing Library");

	init_options = $.extend({}, options.init_options, init_options);
	
	function setMapOptionFn(option) {
	    return function(param) {
		options.maptype[option] = param;
	    };
	}
	
	var setif = [
	    { term : 'host', apply : this.setHost, isSet: this.getHost()},
	    { term : 'protocol', apply : this.setProtocol, isSet: this.getProtocol()},
	    { term : 'path', apply : this.setPath, isSet: this.getPath()},
	    { term : 'maxZoom', isSet : false, apply : setMapOptionFn('maxZoom')},
	    { term : 'minZoom', isSet : false, apply : setMapOptionFn('minZoom')},
	    { term : 'title', isSet: false, apply: setMapOptionFn('title')}
	];

	$.each(setif, function(_, opt) {
	    if(!opt['isSet'] && opt['term'] in init_options && init_options[opt['term']]) 
		opt['apply'].call(this, init_options[opt['term']]);
	}.createDelegate(this));

	//TODO: term, apply, isSet
	this.setMapDivSel(init_options['mapDiv']);
	this.setThumbDivSel(init_options['thumbDiv']);
	this.setMetadata(init_options['metadata']);
	//TODO: set order

	//enforce all data collected/full initialization somehow
	this.getMap(); //init
	
	if(this.getThumbDivSel()) {
	    this.initThumbScroller();
	}
	
	this.resize(init_options['resize']);
	//this.getResize()();
    };

    /* this on needs some serious thought into abstracting*/
    Library.prototype.initThumbScroller = function() {
	var index = null;
	function createThumbnailLink(pageId, pageNum) {
            img = $('<img/>', {
		'src': this.getTileUrl(pageId, 0, 0, 0, 0), 
		'title': this.meta[pageId][0]['imagename'], 
		'alt': 'Page ' + pageNum
	    });
	    
	    //register callbacks on each thumbnail
	    //only fire thumbsLoaded Event when the last callback
	    //has executed
	    img[0].onload = img[0].onerror = function() {
		if(pageNum == index) {
		    var evt = document.createEvent("Event");
		    evt.initEvent("thumbsLoaded", true, true);
		    document.dispatchEvent(evt);
		}
	    };

            anchor = $('<a/>', { 'href': '#' });
            anchor.bind('click', function() {
		this.currentPage(pageId, "0");
            }.createDelegate(this));
            anchor.append(img);
            return anchor;
	}

	//add all thumbnails to scroller container
	for(index in ordering) {
	    if(ordering.hasOwnProperty(index)) {
		var image_key = ordering[index];
		x = createThumbnailLink.call(this, image_key, index);
		$('.jTscroller').append(x);
	    }
	}

	//don't initialize our scroller until all images are loaded
	//this could fail if the last thumbnail is invalid or 404s!
	document.addEventListener("thumbsLoaded", function() {
	    $(this.getThumbDivSel()).append($('<a/>', {
		href: '#',
		class: ['jTscrollerPrevButton']
	    }));
	    $(this.getThumbDivSel()).append($('<a/>', {
		href: '#',
		class: ['jTscrollerNextButton']
	    }));

	    $(this.getThumbDivSel()).thumbnailScroller(options.thumbscroller);
	}.createDelegate(this));
    };

    /* -> onresize? */
    Library.prototype.resize = function(resizeFn) {
	if(this.resizeFn) {
	    $(window).unbind("resize", this.resizeFn);
	}
	if($.isFunction(resizeFn)) {
	    this.resizeFn = resizeFn;
	    $(window).bind("resize", this.resizeFn);
	    this.resizeFn();
	}
    };
    Library.prototype.getResize = function() {
	if(!this.resizeFn) {
	    this.resizeFn = function() {};
	}
	return this.resizeFn;
    };
    
    /** split into multiple functions or delegate to 2*/
    Library.prototype.currentPage = function(page, view) {
	if(page && view) {
	    //TODO: ensure valid
	    if(page != this.page) {
		this.fireNewFolio(page);
	    }
	    //this.lastPage(this.page, this.view);
	    this.page = page;
	    this.view = view;
	    this.reloadTiles();
	    console.log("currentPage: ", page, view,  this.meta[page][view]);
	}

	if(!this.page) {
	    this.page = ordering[0];
	}
	if(!this.view) {
	    this.view = "0";
	}

	return {
	    'page': this.page,
	    'view': this.view
	};
    };
    
    /* make private? */
    Library.prototype.getMapType = function() {
	var map = this.getMap();
	if(!map) return null;
	
	var currentMapType = map.mapTypes.get(map.getMapTypeId);
	return currentMapType;
    };

    /***
     * Dropdown
     ***/

    Library.prototype.syncDropdown = function(selector, list) {
	var optString = "<option value='%v'>%t</option>";
	$(selector).find('option').remove().end();	
	for(var key in list) {
	    if(list.hasOwnProperty(key)) {
		var set = list[key];
		var option = optString.replace(/%v/g, set['value']);
		//TODO: make red if not available
		option = option.replace(/%t/g, set['name']);
		$(selector).append(option);
	    }
	}
    };

    /**
       Figure out key bindings
       save images
     **/

    Library.prototype.bookmarkPage = function(key, page, view) {
	if(!key) { 
	    return;
	}

	if(!this._bookmarks) {
	    this._bookmarks = {};
	}
	if(page && view) {
	    this._bookmarks[key] = this.Bookmark(page, view);
	}
	if(key in this._bookmarks) {
	    return this._bookmarks[key];
	}
	return null;
    };
    
    /** Utils **/
    
    Library.prototype.Bookmark = function(page, view) {
	return {
	    'page': page,
	    'view': view
	}
    };

    function getLibrary() {
	function deny_access() {
	    throw "This library has not yet been initialized!";
	}

	var _lib = new Library();

	var pushback = [];
	var whitelist = ['init', 'setProtocol', 'setHost', 'setPath', 'setMetadata', 'setMapDivSel', 'setThumbDivSel'];
	for(var a in _lib) {
	    if($.isFunction(_lib[a]) && whitelist.indexOf(a) == -1) {
		pushback.push(
		    (function(name, allow_func) {
			return function() {
			    _lib[name] = allow_func;
			};
		    }) (a, _lib[a])
		);
		_lib[a] = deny_access;
	    }
	}
	
	var closed_init = _lib.init;
	_lib.init = function() {
	    for(var grant_access in pushback) {
		if(pushback.hasOwnProperty(grant_access)) {
		    replace = pushback[grant_access];
		    replace();
		}
	    }
	    closed_init.apply(_lib, arguments);
	}
	return _lib;
    }

    var _lib = getLibrary();
    return _lib;
})();






