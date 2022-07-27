
// // init map

var latit;
var longit;
var fov_marker;
var wp_marker;
var fov_to_wp_line;
var new_coords;

const R = 6378137; // radius of earth in meters
const wp_deg_side0 = 90; // side of one endpoint
const wp_deg_side1 = 270;  
const long_side_distance = 300; // distance between long side of waypoints
 
function style(feature) {
    return {
        fillColor: "#ff0000",
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

function drawLine(marker1, marker2, map){
    var latlngs = Array();
    latlngs.push(marker1.getLatLng());
    latlngs.push(marker2.getLatLng());
    var some_line = L.polyline(latlngs, {color: 'red'}).addTo(map);

    return some_line;
}

function computerHaversine(marker1, marker2){
//computes distance between two markers using haversine formula
    lat1 = marker1.getLatLng().lat;
    lat2 = marker2.getLatLng().lat;
    lon1 = marker1.getLatLng().lng;
    lon2 = marker2.getLatLng().lng;
    	
    const R = 6371e3; // metres
    const psi_1 = lat1 * Math.PI/180; // units in radians
    const psi_2 = lat2 * Math.PI/180;
    const dlat = (lat2-lat1) * Math.PI/180;
    const dlon = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
            Math.cos(psi_1) * Math.cos(psi_2) *
            Math.sin(dlon/2) * Math.sin(dlon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres

    return d
}

function convertGPStoCartesian(marker1, marker2){
    //converts gps coordinates to cartesian
    lat1 = marker1.getLatLng().lat;
    lat2 = marker2.getLatLng().lat;
    lon1 = marker1.getLatLng().lng;
    lon2 = marker2.getLatLng().lng;

    dx = R * Math.cos(lat1-lat2) * Math.cos(lon1-lon2);
    dy = R * Math.cos(lat1-lat2) * Math.sin(lon1-lon2);
    z = R * Math.sin(lon1-lon2);

    let cart_vector = [dx,dy,z];
    return cart_vector
}

function convertCartesiantoGPS(cartersian){
    const R = 6371e3; // metres

    lat = Math.asin(cartersian[2]/R);
    long = Math.atan2(cartersian[1]/R);

    gps_vector = [lat,long];
    return gps_vector;
}

function computeBearing(marker1, marker2){
//compute bearing  between two marker points
    lat1 = marker1.getLatLng().lat;
    lat2 = marker2.getLatLng().lat;

    lon1 = marker1.getLatLng().lng;
    lon2 = marker2.getLatLng().lng;
    	
    const psi_1 = lat1 * Math.PI/180; // φ, λ in radians
    const psi_2 = lat2 * Math.PI/180;
    const dlat = (lat2-lat1) * Math.PI/180;
    const dlon = (lon2-lon1) * Math.PI/180;

    const y = Math.sin(dlon) * Math.cos(psi_2);
    const x = Math.cos(psi_1)*Math.sin(psi_2) -
              Math.sin(psi_1)*Math.cos(psi_2)*Math.cos(dlon);
    const theta = Math.atan2(y, x); //wraps from 0 to pi and 0 to -pi
    const brng = (theta*180/Math.PI + 360) % 360; // in degrees

    return brng;
}

function computeDesGPS(marker, brng, d){
    //compute desired gps location based on inputs of marker, brng(degrees) and distance(m)
    brng_rad = brng * Math.PI/180;

    lat1 = marker.getLatLng().lat * Math.PI/180;
    lon1 = marker.getLatLng().lng * Math.PI/180;

    let lat_des =  Math.asin( Math.sin(lat1)*Math.cos(d/R) +
                      Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng_rad));

    let lon_des = lon1 - Math.atan2(Math.sin(brng_rad)*Math.sin(d/R)*Math.cos(lat1),
                            Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat_des));

    lat_des = lat_des* 180/Math.PI;
    lon_des = lon_des * 180/Math.PI;
    return [lat_des, lon_des];

}

function addSquareWP(fov_marker){
    //makes square waypoint based on location of marker
    lat = fov_marker.getLatLng().lat;
    long = fov_marker.getLatLng().lng;

    const des_dist = 150; // meters

    new_latitude  = lat  + ((des_dist / R) * (180 / Math.PI));
    new_longitude = long + ((des_dist / R) * (180 / Math.PI) / Math.cos(lat));   

    wp_coords = [new_latitude, new_longitude];

    return wp_coords;
}

//button
let waypoint_btn = document.createElement("button");
waypoint_btn.className = "setTestButton"
waypoint_btn.innerHTML = "Set Waypoints";
waypoint_btn.onclick = function () {
    if (fov_marker){

        bearing_ori_to_fov = computeBearing(origin_marker, fov_marker); // degrees

        waypoint_coords = computeDesGPS(fov_marker, wp_deg_side1-bearing_ori_to_fov, long_side_distance/2);
        waypoint_coords_1 = computeDesGPS(fov_marker, wp_deg_side0-bearing_ori_to_fov, long_side_distance/2);

        wp_marker = new L.CircleMarker(waypoint_coords,
            {color:'green'}).addTo(map);
            
        wp_marker = new L.CircleMarker(waypoint_coords_1,
            {color:'green'}).addTo(map);        

        bearing_fov_to_wp = computeBearing(fov_marker, wp_marker);
        distance = computerHaversine(fov_marker, wp_marker);
            
        console.log("wp coords", waypoint_coords);
        console.log("fov coords", fov_marker.getLatLng());
    
        console.log("distance", distance);
        console.log("bearing_origin_to_wp", bearing_ori_to_fov);
        console.log("bearing_fov_to_wp", bearing_fov_to_wp);
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

    var origin_marker = L.marker([34.973328967646175, -117.85634994506837]).addTo(map). 
    bindPopup("<b>This is where you are at </b><br />");

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
        var origin_marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
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
]; 


var myGeoJson = L.geoJson(myData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
  

//set to one marker
map.on('dblclick', function (e) {
    if (fov_marker) { 
        map.removeLayer(fov_marker); 
    }

    if (fov_to_wp_line){
        map.removeLayer(fov_to_wp_line);
    }

    fov_marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map)
    .bindPopup("<b>Field of View Marker, you can change the marker by double clicking again</b><br />");
    
    fov_to_wp_line = drawLine(origin_marker, fov_marker, map);
});

