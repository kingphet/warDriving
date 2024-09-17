  import { useState } from 'react';
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  import Papa from 'papaparse';
  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
  import NavBar from '../layout/navBar';
  
  import location_red from '../assets/location_red.png';
  import location_green from '../assets/location_green.png';
  import location_yellow from '../assets/location_yellow.png';
  
  // Icon definitions
  const redIcon = new L.Icon({
    iconUrl: location_red,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'red-marker-icon',
  });
  
  const yellowIcon = new L.Icon({
    iconUrl: location_yellow,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'yellow-marker-icon',
  });
  
  const greenIcon = new L.Icon({
    iconUrl: location_green,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'green-marker-icon',
  });
  
  // Reset default icon
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: null,
    shadowUrl: null,
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  const Location = () => {
    const bangkokCenter = [17.9765248, 102.6326528];
    const [markers, setMarkers] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [analyzedData, setAnalyzedData] = useState(null);
    const [deviceAnalysis, setDeviceAnalysis] = useState(null);
  
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
  
      if (file) {
        Papa.parse(file, {
          header: true,
          complete: (result) => {
            const data = result.data;
            const formattedMarkers = data
              .map((row) => ({
                SSID: row.SSID || row.name || 'Unknown',
                BSSID: row.BSSID,
                latitude: parseFloat(row.latitude),
                longitude: parseFloat(row.longitude),
                signal: parseFloat(row.signal),
                ENCRYPTION: row.ENCRYPTION,
                AUTHENTICATION: row.AUTHENTICATION,
                CHANNEL: row.CHANNEL,
                RADIO_TYPE: row.RADIO_TYPE || 'Unknown',
                frequency: parseFloat(row.frequency),
                MANUFACTURER: row.MANUFACTURER
              }))
              .filter((marker) => !isNaN(marker.latitude) && !isNaN(marker.longitude));
  
            setMarkers(formattedMarkers);
            setAnalyzedData(formattedMarkers);
            analyzeWifiDevices(formattedMarkers);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      }
    };
  
    const analyzeWifiDevices = (devices) => {
      const uniqueDevices = new Set(devices.map(device => device.BSSID));
      const totalDevices = uniqueDevices.size;
  
      const manufacturerCount = devices.reduce((acc, device) => {
        acc[device.MANUFACTURER] = (acc[device.MANUFACTURER] || 0) + 1;
        return acc;
      }, {});
  
      const mobileKeywords = ['mobile', 'phone', 'android', 'iphone', 'xiaomi', 'oppo', 'vivo', 'samsung'];
      const mobileDevices = devices.filter(device => 
        mobileKeywords.some(keyword => 
          (device.MANUFACTURER && device.MANUFACTURER.toLowerCase().includes(keyword)) || 
          (device.SSID && device.SSID.toLowerCase().includes(keyword))
        )
      );
      const routerDevices = devices.filter(device => !mobileDevices.includes(device));
  
      setDeviceAnalysis({
        totalDevices,
        mobileDevices: mobileDevices.length,
        routerDevices: routerDevices.length,
        manufacturerBreakdown: Object.entries(manufacturerCount)
          .sort((a, b) => b[1] - a[1])
          .map(([manufacturer, count]) => ({ name: manufacturer, value: count })),
        mobileDevicesList: mobileDevices.map(device => `${device.SSID} (${device.MANUFACTURER})`),
        routerDevicesList: routerDevices.map(device => `${device.SSID} (${device.MANUFACTURER})`)
      });
    };
  
    const getMarkerIcon = (signal) => {
      if (signal >= -60) return greenIcon;
      if (signal >= -90) return yellowIcon;
      return redIcon;
    };
  
    const countOccurrences = (arr, key) => {
      return arr.reduce((acc, curr) => {
        const value = curr[key];
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
    };
  
    const groupDataIntoRanges = (data, key, ranges) => {
      const groupedData = ranges.map(range => ({ name: range.label, value: 0 }));
      data.forEach(item => {
        const value = item[key];
        const rangeIndex = ranges.findIndex(range => value >= range.min && value < range.max);
        if (rangeIndex !== -1) {
          groupedData[rangeIndex].value++;
        }
      });
      return groupedData;
    };
  
    const getChartData = () => {
      if (!analyzedData) return null;
  
      const encryptionData = Object.entries(countOccurrences(analyzedData, 'ENCRYPTION')).map(([name, value]) => ({ name, value }));
      const authenticationData = Object.entries(countOccurrences(analyzedData, 'AUTHENTICATION')).map(([name, value]) => ({ name, value }));
      const radioTypeData = Object.entries(countOccurrences(analyzedData, 'RADIO_TYPE')).map(([name, value]) => ({ name, value }));
      
      const signalRanges = [
        { min: -Infinity, max: -90, label: '-Infinity to -90 dBm' },
        { min: -90, max: -60, label: '-90 to -60 dBm' },
        { min: -60, max: -30, label: '-60 to -30 dBm' },
        { min: -30, max: Infinity, label: '-30 to Infinity dBm' }
      ];
      const signalData = groupDataIntoRanges(analyzedData, 'signal', signalRanges);
  
      const frequencyRanges = [
        { min: 0, max: 2.4, label: '0 - 2.4 GHz' },
        { min: 2.4, max: 5, label: '2.4 - 5 GHz' },
        { min: 5, max: Infinity, label: '5+ GHz' }
      ];
      const frequencyData = groupDataIntoRanges(analyzedData, 'frequency', frequencyRanges);
  
      const deviceTypeData = [
        { name: 'Mobile', value: deviceAnalysis ? deviceAnalysis.mobileDevices : 0 },
        { name: 'Router', value: deviceAnalysis ? deviceAnalysis.routerDevices : 0 }
      ];
  
      return { 
        encryptionData, authenticationData, radioTypeData, frequencyData, signalData, deviceTypeData,
        manufacturerData: deviceAnalysis ? deviceAnalysis.manufacturerBreakdown : []
      };
    };
  
    const chartData = getChartData();
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">WiFi Location Map and Data Analysis</h1>
            <div className="mb-4">
              <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <label
                  htmlFor="csvFile"
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  Choose CSV file
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">WiFi Location Map</h2>
            <MapContainer
              center={bangkokCenter}
              zoom={11}
              style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((marker, index) => (
                !isNaN(marker.latitude) && !isNaN(marker.longitude) && (
                  <Marker
                    key={index}
                    position={[marker.latitude, marker.longitude]}
                    icon={getMarkerIcon(marker.signal)}
                  >
                    <Popup>
                      <div className="text-sm space-y-1">
                        <p><strong>SSID:</strong> {marker.SSID}</p>
                        <p><strong>BSSID:</strong> {marker.BSSID}</p>
                        <p><strong>Encryption:</strong> {marker.ENCRYPTION}</p>
                        <p><strong>Authentication:</strong> {marker.AUTHENTICATION}</p>
                        <p><strong>Channel:</strong> {marker.CHANNEL}</p>
                        <p><strong>Radio Type:</strong> {marker.RADIO_TYPE}</p>
                        <p><strong>Frequency:</strong> {marker.frequency}</p>
                        <p><strong>Latitude:</strong> {marker.latitude.toFixed(4)}</p>
                        <p><strong>Longitude:</strong> {marker.longitude.toFixed(4)}</p>
                        <p><strong>Signal:</strong> {marker.signal} dBm</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>

          {chartData && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Encryption Types</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.encryptionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.encryptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Authentication Methods</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.authenticationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Radio Types</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.radioTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.radioTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Frequency Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Signal Strength Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.signalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Device Types</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.deviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;