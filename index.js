/******
 * LICENSE
 **/

/**************************************
 * import environment variable config *
 **************************************/
function setup(protocol, host, path) {
    palimpsest.setProtocol(protocol).setHost(host).setPath(path);
}

function collapse() {
    var collapsed = $('.rpanel').hasClass('collapsed');
    if(collapsed) {
	$('.rpanel').removeClass('collapsed');
	$('.instructions').css('display', 'block');
	$('.content').css('display', 'block');
	palimpsest.getResize()();
	return false;
    } else {
	$('.rpanel').addClass('collapsed');
	$('.instructions').css('display', "none");
	$('.content').css('display', 'none');
	palimpsest.getResize()();
	return true;
    }
}

function syncLayers(page) {
    var layers = $.map(metadata[page], function(item, key) {
	return {
	    'value': item['index'],
	    'name' : item['imagename']
	};
    });
    palimpsest.syncDropdown('.layer', layers);
}

function registerListeners() {
    document.addEventListener("newFolio", function(evt) {
	syncLayers(evt.page);
    });

    $('.layer').change(function (evt) {
	var index = $('.layer').val();
	//TODO: split up current page
	var current = palimpsest.currentPage();
	palimpsest.currentPage(current['page'], index);
    });

    $(document).keypress(function(evt){ 
	var list_set = [33, 64, 35, 36, 37, 94, 38, 42, 40, 41];
	var list_get = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48];
	var x = evt.charCode;
	var index = list_get.indexOf(x) + 1;
	console.log("get: " + index)
	if(index != -1) {
	    p = palimpsest.bookmarkPage(index);
	    console.log("get: ", p);
	    if(p != null) {
		palimpsest.currentPage(p['page'], p['view']);
	    }
	}
	index = list_set.indexOf(x) + 1;
	console.log("set: " + index);
	if(index != -1) {
	    p = palimpsest.currentPage();
	    console.log("set: ", p);
	    palimpsest.bookmarkPage(index, p['page'], p['view']);
	}
    });
}

/**/
$(window).load(function() {
    $('.collapse_action').click(function() {
	var is_collapsed = collapse();
	$('.collapse_action').children().remove();
	$('.collapse_action').append($('<img/>', {
	    'src': is_collapsed ? 'static/bca-l.png' : 'static/bca-r.png',
	    'class' : [ 'collapse_icon' ]
	}));
    });

    //palimpsest.setMetadata(metadata);

    //palimpsest.setMapDivSel('#gmaps_container');
    //palimpsest.setThumbDivSel('#ts_container');
    
    var resize = function() {
        var body    = $('body');
        var margins = body.outerHeight(true) - body.height();
	var mapHeight  = window.innerHeight-$('.menubar').outerHeight(true)-palimpsest.thumbOuterHeight(true)-margins;
	palimpsest.mapHeight(mapHeight);
	$('.rpanel').height(window.innerHeight-$('.menubar').outerHeight(true)-margins-4);
	
        margins = body.outerWidth(true) - body.width();
	palimpsest.thumbWidth(window.innerWidth-margins-14 - $('.rpanel').outerWidth(true));
	
	palimpsest.mapWidth(window.innerWidth-margins-4-$('.rpanel').outerWidth(true));


    };
    //palimpsest.resize(resize);
    

 
    palimpsest.init({
	'mapDiv' : '#gmaps_container',
	'thumbDiv' : '#ts_container',
	'metadata' : metadata,
	'resize'   : resize,
	'title'  : 'Archimedes Palimpsest',
	'maxZoom' : 5,
	'minZoom' : 0
    });

    registerListeners();
    syncLayers(palimpsest.currentPage()['page']);
});
