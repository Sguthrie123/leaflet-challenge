// Creating map object
const API_KEY = "pk.eyJ1IjoiZHlsYW5tMjA5NCIsImEiOiJja2F0cDhkMTUwc3hsMnJwM3NrMHc4czFiIn0.okZ9I32JtD7-hu-ZzUbekw";
const MAP_URL = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data) {
    createFeatures(data.features);
  });


function createFeatures(earthquake) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"+
          "</he><hr><p>" + feature.properties.mag + "</p>");
        } 
    
        var earthquakes = L.geoJSON(earthquake, {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
        
                //depends on the magnitude, dsiplay different color
                var color;
                if (feature.properties.mag  > 5){
                  color="crimson"
                } 
                else if (feature.properties.mag  > 4){
                  color="LightSalmon"
                } 
                else if (feature.properties.mag  > 3){
                  color="Moccasin"
                } 
                else if (feature.properties.mag  > 2){
                  color="PeachPuff"
                } 
                else if (feature.properties.mag  > 1){
                  color="LightGreen"
                } 
                else{
                  color= "LimeGreen"
                }
            
             //provide properties for the circles
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }  
  });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define slightmap satellitemap and outdoormap layers
    var lightmap = L.tileLayer(MAP_URL, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10', 
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    var baseMaps = {
        "Grayscale": lightmap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom:4,
        layers: [lightmap, earthquakes]
      });
    
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    function getColor(d){
        return d > 5 ? "crimson" :
        d > 4 ? "LightSalmon" :
        d > 3 ? "Moccasin" :
        d > 2 ? "PeachPuff" :
        d > 1 ? "LightGreen" :
        "LimeGreen";
      }

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend"),
        grades=[0,1,2,3,4,5],
        labels = [];

        div.innerHTML+='Magnitude<br><hr>'

        for (var i=0; i<grades.length; i++){
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
}

