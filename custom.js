// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">


/*   You can easily setting some data on DATA.JSON file. */
var g_mapData = { 
    "updateTime": 0.234582393,                              // Random value between 0 ~ 1
    "mainPos": { "Lat": 37.779, "Lng": -122.434 },          // This position is the first loading map position
    "mainZoom": 15,                                         // Zoom scale of the first loading map
    "mapType": "satellite",                                 // satellite, roadmap, hybrid, terrian
    "heatData":                                             // circle animation position array
    [                                               
        { "Lat": 37.782551, "Lng": -122.445368, "AP": 0.2 }, // AP : 0 ~ 1
        { "Lat": 37.784746, "Lng": -122.422818, "AP": 0.8 },
        { "Lat": 37.775467, "Lng": -122.432939, "AP": 0.6 }
    ]
}

var map, heatmap;
var overlay;

var areaArray;
var apArray;
var mainPos;
var mainZoom;
var mapType;
var mapRadius;

var updatedTime = "abc";

function initMap() {
    getDataAgain();
}

function setMapData() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: mainZoom,
        center: mainPos,
        mapTypeId: mapType
    });

    // console.log(mapRaidus);
    for (var i = 0; i < areaArray.length; i++) {
        var eachData = [areaArray[i]];
        var randomHeat = new google.maps.visualization.HeatmapLayer({
            data: eachData,
            map: map,
            dissapating: false
        });
        randomHeat.set('radius', randomHeat.get('radius') ? null : mapRadius);

        var red = Math.floor(255 * (1 - apArray[i]));
        var green = Math.floor(255 * apArray[i]);
        var gradient = [
            'rgba(' + red + ', ' + green + ', 0, 0)',
            'rgba(' + red + ', ' + green + ', 0, 1)'
        ]
        randomHeat.set('gradient', randomHeat.get('gradient') ? null : gradient);
        randomHeat.set('opacity', randomHeat.get('opacity') ? null : 1);
    }



    map.addListener('center_changed', function() {
        for (var i = 0; i < areaArray.length; i++) {
            var id = "animation" + (i + 1);
            var info = document.getElementById(id);
            var point = overlay.getProjection().fromLatLngToContainerPixel(areaArray[i]);
            info.style.left = point.x + 'px';
            info.style.top = point.y + 'px';
        }
    });

    map.addListener('zoom_changed', function() {
        for (var i = 0; i < areaArray.length; i++) {
            var id = "animation" + (i + 1);
            var info = document.getElementById(id);
            info.style.display = 'none';
        }

        setTimeout(startAnimation, 1000);
    });

    google.maps.event.addListener(map, 'projection_changed', function() {
        overlay = new google.maps.OverlayView();
        overlay.draw = function() {};
        overlay.setMap(map);

        setTimeout(startAnimation, 1000);
    });

    function startAnimation() {
        var anims = document.getElementById('anims');

        var innerTags = "";
        for (var i = 0; i < areaArray.length; i++) {
            var id = "animation" + (i + 1);
            var style = "";

            var red = Math.floor(255 * (1 - apArray[i]));
            var green = Math.floor(255 * apArray[i]);
            style = 'box-shadow: 0 0 2px 2px rgba(' + red + ', ' + green + ', 0, 1); background : rgba(' + red + ', ' + green + ', 0, 1);';

            innerTags = innerTags + '<div class="animation" id="' + id + '"><div class="dot" style="' + style + '"></div></div>';
        }
        anims.innerHTML = innerTags;

        for (var i = 0; i < areaArray.length; i++) {
            var id = "animation" + (i + 1);
            var info = document.getElementById(id);

            var point = overlay.getProjection().fromLatLngToContainerPixel(areaArray[i]);

            info.style.left = point.x + 'px';
            info.style.top = point.y + 'px';
            info.style.display = 'block';
        }


    }
}

function getDataAgain() {
    areaArray = [];
    apArray = [];

    var anims = document.getElementById('anims');
    anims.innerHTML = "";

    updatedTime = g_mapData.updateTime;
    mainPos = new google.maps.LatLng(g_mapData.mainPos.Lat, g_mapData.mainPos.Lng);
    mainZoom = g_mapData.mainZoom;
    mapType = g_mapData.mapType;
    mapRadius = g_mapData.mapRadius;
    $.each(g_mapData.heatData, function(i, obj) {
        areaArray.push(new google.maps.LatLng(obj.Lat, obj.Lng));
        apArray.push(obj.AP);
        setMapData();
    });
}