/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
const token = document.getElementById('map').dataset.token;

mapboxgl.accessToken = token;

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/maxiu271299/ck9igzxwg5sct1iqgfreduysz',
  scrollZoom: false
});

//Area  which will be display
const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add marker to map
   new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Extend map bounds to include current locations
  bounds.extend(loc.coordinates);
});

map.on('click', e => {
  console.log(e);
  locations.forEach(loc => {
    if(Math.abs(e.lngLat.lat - loc.coordinates[1]) < 0.5 && Math.abs(e.lngLat.lng - loc.coordinates[0]) < 0.5){
      new mapboxgl.Popup({
        offset: 30
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p class="paragraph">${loc.description}</p>`)
        .addTo(map);
    }
  })


})


map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 250,
    left: 200,
    right: 200
  }
});
