/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibWF4aXUyNzEyOTkiLCJhIjoiY2s5aGh2ZDg4MDhjYzNtdGkwN3RvNTZucyJ9.HYPmad7VUIY_Vj8S1QupnQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});
