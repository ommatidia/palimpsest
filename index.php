<html>
  <head>
    
    <link rel="stylesheet" href="static/css/jquery.thumbnailScroller.css"></link>
    <link rel="stylesheet" href="static/css/palimpsest.css"></link>
    <link rel="stylesheet" href="static/css/styles.css"></link>
    
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="static/js/jquery-ui-1.8.13.custom.min.js" type="text/javascript"></script>
    <?php
       $key = getenv('GMAPS_API_KEY');
       printf('<script src="http://maps.googleapis.com/maps/api/js?key=%s&sensor=true" type="text/javascript"></script>', $key);
    ?>
    <script src="static/js/jquery.thumbnailScroller.js" type="text/javascript"></script>
    <script src="static/js/palimpsest.js" type="text/javascript"></script>
    <script src="tiles/metadata.json" type="text/javascript"></script>
    <script src="tiles/ordering.json" type="text/javascript"></script>
    <script src="index.js" type="text/javascript"></script>
    <script type="text/javascript">
      <?php 
	 printf("setup('%s', '%s', '%s');", getenv('IMAGERY_PROTOCOL'), getenv('IMAGERY_HOST'), getenv('IMAGERY_PATH'));
      ?>
    </script>
  </head>
  
  <body>
    <div id="menubar" class="menubar">
      <div class="title">The Galen Palimpsest</div>
      
      <div class="spacer">
	<label>Layer: </label>
	<select class="layer"></select>
      </div>
      
    </div>
    <div id="gmaps_container" class="map"></div>
    <div class="rpanel">
      <div class="header">
	<div class="collapse_action" style="float: left;">
	  <img src="static/bca-r.png" class="collapse_icon"/>
	</div>
	<div class="instructions" style="float: right;">
	  Features
	</div>
      </div>
      <div class="content">
	<ul>
	  <li>
	    You can bookmark particular images via Shift+Number
	  </li>
	  <li>
	    You can recall any previously saved bookmark via Number
	  </li>
	</ul>
      </div>
    </div>

    <div id="ts_container"></div>
    
  </body>
</html>
