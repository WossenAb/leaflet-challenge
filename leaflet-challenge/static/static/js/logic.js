// Store our API endpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" ;
  // "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request from URL
d3.json(queryUrl, function(err,data) {

	if(err) console.log("error fetching data");
// data holds the file content


  // Capture response and send data.features object to the createFeatures function


  createFeatures(data.features);
});


function markerSize(mag){
  return mag * 5;
}

function markerColor(mag){
  if (mag > 5) {
    color = "#8B0000";
} else if (mag > 4) {
    color = "#FF0000";
} else if  (mag > 3) {
  color = "#CD5C5C";
} else if (mag > 2) {
  color = "#E9967A";
} else {
  color = "#FFA07A";
}
return(color)
}

var Lcolors = ["#8B0000", "#FF0000", "#CD5C5C", "#E9967A", "#FFA07A"]
var maglevels = ['5+', '4-5', '3-4', '2-3', '< 2']


function createFeatures(earthquakeData) {

 
  // Assign a pop-up to each location describing the place and time of earthquake incidents

  function onEachFeature(feature, layer) {

     layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "<br><strong>" + "mag: " + feature.properties.mag + "</strong></p>");
  }

  function style(feature) {
    var mag = feature.properties.mag; 
    var color_value = markerColor(mag);

    return {radius: markerSize(mag),
      color: "#000",

      fillColor:color_value,
      fillOpacity: 0.8,
      weight: 1,
      opacity: 0}
    }

  // Create a GeoJSON layer containing the features array on the earthquakeData object

  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, style(feature));

    },

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);

}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY

  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

 // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [

      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]

  });

  
  // Passing base and overlay Maps
  // Add the layer control

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


}

