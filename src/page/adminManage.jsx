import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NavBar from '../layout/navBar';
import wifi_day1 from '../wifi_day1.json';
import wifi_day4 from '../wifi_day4.json';
import location_red from '../assets/location_red.png';
import location_green from '../assets/location_green.png';
import location_yellow from '../assets/location_yellow.png';

// Create custom red and blue marker icons
const redIcon = new L.Icon({
  // iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconUrl: location_red,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'red-marker-icon',
});

const yellowIcon = new L.Icon({
  // iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: location_yellow,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'blue-marker-icon',
});

const greenIcon = new L.Icon({
  // iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconUrl: location_green,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'default-marker-icon',
});

// Remove default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: null,
  iconUrl: null,
  shadowUrl: null,
});

const AdminManage = () => {
  const bangkokCenter = [17.9765248, 102.6326528]; // Updated to match the data's location

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Simulating data fetch
    const fetchData = async () => {
      // const data = wifi_day1;
      const data = wifi_day4;
      setMarkers(data);
    };

    fetchData();
  }, []);

  const addMarker = (e) => {
    const newMarker = {
      SSID: `New Marker ${markers.length + 1}`,
      BSSID: `XX:XX:XX:XX:XX:XX`,
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      signal: -50, // Default signal strength
    };
    setMarkers([...markers, newMarker]);
  };

  const getMarkerIcon = (signal) => {
    if (signal >= -60) {
      return greenIcon; // Red icon for signal stronger than -30
    } else if (signal >= -90) {
      return yellowIcon; // Blue icon for signal between -60 and -30
    }
    return redIcon; // Default icon for signals weaker than -60
  };

  return (
    <>
      <NavBar />
      <div className="w-full">
        <MapContainer
          center={bangkokCenter}
          zoom={11}
          style={{ height: '800px', width: '100%' }}
          onClick={addMarker}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.latitude, marker.longitude]}
              icon={getMarkerIcon(marker.signal)}
            >
              <Popup>
                SSID: {marker.SSID}
                <br />
                BSSID: {marker.BSSID}
                <br />
                Encrption: {marker.ENCRYPTION}
                <br />
                Authentication: {marker.AUTHENTICATION}
                <br />
                Channel: {marker.CHANNEL}
                <br />
                Radio_type: {marker.RADIO_TYPE}
                <br />
                Frequency: {marker.frequency}
                <br />
                Latitude: {marker.latitude.toFixed(4)}
                <br />
                Longitude: {marker.longitude.toFixed(4)}
                <br />
                Signal: {marker.signal} dBm
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default AdminManage;
