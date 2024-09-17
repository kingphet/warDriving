import { useState } from 'react';
import axios from 'axios';
import { Upload, X } from 'lucide-react';
import NavBar from '../layout/navBar';

const Alert = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span className="block sm:inline">{children}</span>
  </div>
);

const FileUpload = () => {
  const [kmlFile, setKmlFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!kmlFile || !csvFile) {
      setError('Please upload both KML and CSV files.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('kmlFile', kmlFile);
    formData.append('csvFile', csvFile);

    try {
      const response = await axios.post('https://flask-app-dd1q.onrender.com/process', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged_output.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      setError('An error occurred processing the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FileInput = ({ id, label, accept, onChange, file }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to select file</span> or drag and drop here
            </p>
            <p className="text-xs text-gray-500">{accept.toUpperCase()} (Max 10MB)</p>
          </div>
          <input id={id} type="file" className="hidden" accept={accept} onChange={onChange} />
        </label>
      </div>
      {file && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={() => onChange({ target: { files: [] } })}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
   <>
   <NavBar />
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Upload KML and CSV</h1>
        <form onSubmit={handleSubmit}>
          <FileInput
            id="kmlFile"
            label="File KML:"
            accept=".kml"
            onChange={(e) => handleFileChange(e, setKmlFile)}
            file={kmlFile}
          />
          <FileInput
            id="csvFile"
            label="File CSV:"
            accept=".csv"
            onChange={(e) => handleFileChange(e, setCsvFile)}
            file={csvFile}
          />
          {error && <Alert>{error}</Alert>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {loading ? 'Processing...' : 'Upload file'}
          </button>
        </form>
      </div>
    </div>
   </>
  );
};

export default FileUpload;