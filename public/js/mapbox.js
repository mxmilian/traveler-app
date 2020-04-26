/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibWF4aXUyNzEyOTkiLCJhIjoiY2s5aGh2ZDg4MDhjYzNtdGkwN3RvNTZucyJ9.HYPmad7VUIY_Vj8S1QupnQ';
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/maxiu271299/ck9hiue6y177a1il7nrlzgth9'
  // center: [ 17.5226874, 53.7000897],
  // zoom: 10,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //Create marker
  const element = document.createElement('div');
  element.className = 'marker';

  //Add marker
  new mapboxgl.Marker({
    element,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);


  //Extend marker
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 400,
    right: 400
  }
});
