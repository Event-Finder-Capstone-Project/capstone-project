import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -41.14961,
  lng: -8.61099
};

function Maps() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDrusDlQbaU-_fqPwkbZfTP1EMDzvQMGWU"
  })

  const [map, setMap] = React.useState(null)
  const [markers, setMarkers] = React.useState([]);
  const [selectedDest, setSelectedDest] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onMapClick = React.useCallback((event) => {
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date()
    }]);
  }, []);

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components - need to put markers for Events */ }
        {markers.map((marker) => (
        <Marker
          key={marker.time.toISOString()}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => {
            setSelectedDest(marker)
          }}
        />
      ))}
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(Maps)
