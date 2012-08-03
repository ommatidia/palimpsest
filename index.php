<html>
  <head>
    
    <link rel="stylesheet" href="static/css/jquery.thumbnailScroller.css"></link>
    <link rel="stylesheet" href="static/css/styles.css"></link>
    
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="static/js/jquery-ui-1.8.13.custom.min.js" type="text/javascript"></script>
    <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyB8wuSJdYBYyYXHH8x8wTHyS5vnX8Xtyvo&sensor=true" type="text/javascript"></script>
    
    <script src="static/js/jquery.thumbnailScroller.js" type="text/javascript"></script>
    <script src="pages.js" type="text/javascript"></script>
    <script src="index.js" type="text/javascript"></script>
  </head>
  
  <body>
    <div id="menubar" class="menubar">
      <div class="title">The Archimedes Palimpsest</div>
      <div class="spacer">
	<button id="ppage">Prev Folio</button>
	<button id="npage">Next Folio</button>
	<button id="prev">Prev Layer</button>
	<button id="next">Next Layer</button>
      </div>
    </div>
    <div id="gmaps_container" class="map"></div>
    <div class="rpanel"></div>
    
    <div id="ts2_container" class="jThumbnailScroller">
      <div class="jTscrollerContainer">
	<div class="jTscroller"></div>
      </div>
      <a href="#" class="jTscrollerPrevButton"></a>
      <a href="#" class="jTscrollerNextButton"></a>
    </div>
    <script>/*
      window.onload = function() {
      function createThumbnailLink(pageId, pageNum) {
      img = document.createElement('img');
      img.setAttribute('src', 'tiles/' + pageId + '/1/level_0/0_0.png');
      img.setAttribute('title', 'Page ' + pageNum);
           img.setAttribute('alt', 'Page ' + pageNum);
           
           
           anchor = $('<a/>', { 'href': '#' });
           anchor.bind('click', function() {
               currentPage(pageId, "1");
           });
           anchor.append(img);
           return anchor;
       }
       var num = 1;
       for(key in pages) {
          x = createThumbnailLink(key, num);
          num++;
          $('.jTscroller').append(x);
       }
       $('#ts2_container').thumbnailScroller({
           noScrollCenterSpace: 400,
           scrollerType: 'clickButtons',
           acceleration: 2,
           scrollSpeed: 800
       });
    };*/
  </script>

</body>
</html>
