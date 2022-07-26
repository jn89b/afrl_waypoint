
// // init map

var latit;
var longit;
var fov_marker;
var wp_marker;

function style(feature) {
    return {
        fillColor: "#FCB81E",
        weight: 2,
        opacity: 1,
        color: "#CCCCCC",
        fillOpacity: 0.35
    };
}

function onEachFeature(feature,layer) {
    layer.on('mouseover', function () {
      this.setStyle({
        'fillColor': '#0000ff'
      });
    });
    layer.on('mouseout', function () {
      this.setStyle({
        'fillColor': '#ff0000',
        'fillOpacity': 0.35
      });
    });
}

//button
let waypoint_btn = document.createElement("button");
waypoint_btn.className = "setTestButton"
waypoint_btn.innerHTML = "Set Waypoints";
waypoint_btn.onclick = function () {
    if (fov_marker){
        alert(fov_marker.getLatLng());
        wp_marker = new L.CircleMarker([34.974485, -117.856656],
            {color:'green'}).addTo(map); 
    }
    else{
        alert("No inputs");
    }
};
document.body.appendChild(waypoint_btn);


const map = L.map('map',{
    center: [34.973328967646175, -117.85634994506837],
    zoom: 25
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var abc = L.marker([34.973328967646175, -117.85634994506837]).addTo(map);

    // Set the map view to the user's location
    // Uncomment below to set map according to user location
    // map.locate({setView: true, maxZoom: 16});
    
//set location based on user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log('--- Your Position: ---');
        console.log('Lat: ' + position.coords.latitude);
        latit = position.coords.latitude;
        console.log('Long: ' + position.coords.longitude);
        longit = position.coords.longitude;
        console.log('---------------------');
        var abc = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    } 
)}

//THIS TAKES IN LON,LAT COORDINATES -> LEAFLET WILL CONVERT TO LAT,LON
//ORDER IS UPPER LEFT, LOWER LEFT, LOWER RIGHT, UPPER RIGHT, UPPER LEFT
var myData = [{
"type": "FeatureCollection",
"features": [{
    "type": "Feature",
    "properties": {
    "popupContent": "C10"
    },
    "geometry": {
    "type": "Polygon",
    "coordinates": [[[ -117.866667, 34.983333],
        [-117.866667, 34.966667],
        [-117.85, 34.966667],
        [ -117.85, 34.983333],
        [ -117.866667, 34.983333]]]
    }
}]}, 
{
"type": "FeatureCollection",
"features": [{
    "type": "Feature",
    "properties": {
    "popupContent": "C11"
    },
    "geometry": {
    "type": "Polygon",
    "coordinates": [[[-117.85, 34.966667],
        [ -117.85, 34.983333],
        [ -117.833333, 34.983333],
        [-117.833333, 34.966667],
        [ -117.85, 34.966667]]]
        }
    }]},
{
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
        "popupContent": "D10"
        },
        "geometry": {
        "type": "Polygon",
        "coordinates": [[[-117.866667, 34.966667],
            [ -117.866667, 34.95],
            [ -117.85, 34.95],
            [-117.85, 34.966667],
            [ -117.866667, 34.966667]]]
            }
    }]},
{
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
        "popupContent": "D11"
        },
        "geometry": {
        "type": "Polygon",
        "coordinates": [[[ -117.85, 34.95],
            [-117.85, 34.966667],
            [-117.833333, 34.966667],
            [ -117.833333, 34.95],
            [ -117.85, 34.95]]]
            }
    }]}
]

// var states = [{
//     "type": "Feature",
//     "properties": {"party": "Republican"},
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [[
//             [-104.05, 48.99],
//             [-97.22,  48.98],
//             [-96.58,  45.94],
//             [-104.03, 45.94],
//             [-104.05, 48.99]
//         ]]
//     }
// }, {
//     "type": "Feature",
//     "properties": {"party": "Democrat"},
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [[
//             [-109.05, 41.00],
//             [-102.06, 40.99],
//             [-102.03, 36.99],
//             [-109.04, 36.99],
//             [-109.05, 41.00]
//         ]]
//     }
// }];
  
var myGeoJson = L.geoJson(myData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
  

//set to one marker
map.on('dblclick', function (e) {
    if (fov_marker) { // check
        map.removeLayer(fov_marker); // remove
    }
    fov_marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
});

