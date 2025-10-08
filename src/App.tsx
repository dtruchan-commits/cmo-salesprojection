import { useState } from 'react'
import ContractUpload from './components/ContractUpload'
import ForecastUpload from './components/ForecastUpload'
import DataVisualization from './components/DataVisualization'
import './App.css'

function App() {
  const [uploadedContracts, setUploadedContracts] = useState<File[]>([])
  const [uploadedForecasts, setUploadedForecasts] = useState<File[]>([])

  const handleContractUpload = (file: File) => {
    console.log('Contract uploaded:', file.name)
    setUploadedContracts(prev => [...prev, file])
    // Here you would typically send the contract to your server
    // for analysis and processing
  }

  const handleForecastUpload = (file: File) => {
    console.log('Forecast uploaded:', file.name)
    setUploadedForecasts(prev => [...prev, file])
    // Here you would typically send the forecast to your server
    // for data analysis and integration
  }

  return (
    <>
      <div className="app-header">
        <h1>CMO Sales Projection</h1>
        <p>Upload your contract documents and forecast files for comprehensive sales analysis</p>
      </div>
      
      <div className="main-content">
        <div className="upload-section">
          <ContractUpload 
            onContractUpload={handleContractUpload}
            maxFileSize={15}
            multiple={true}
          />
        </div>

        <div className="upload-section">
          <ForecastUpload 
            onForecastUpload={handleForecastUpload}
            maxFileSize={25}
            multiple={true}
          />
        </div>
        
        {(uploadedContracts.length > 0 || uploadedForecasts.length > 0) && (
          <div className="upload-summary">
            <h3>Analysis Summary</h3>
            
            {uploadedContracts.length > 0 && (
              <div className="summary-section">
                <h4>📋 Contracts ({uploadedContracts.length})</h4>
                <ul>
                  {uploadedContracts.map((contract, index) => (
                    <li key={`contract-${index}`}>
                      {contract.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {uploadedForecasts.length > 0 && (
              <div className="summary-section">
                <h4>📊 Forecasts ({uploadedForecasts.length})</h4>
                <ul>
                  {uploadedForecasts.map((forecast, index) => (
                    <li key={`forecast-${index}`}>
                      {forecast.name.replace(/\.(xlsx|xls|csv)$/i, '').replace(/[-_]/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="analysis-actions">
              <button className="analyze-button" disabled={uploadedContracts.length === 0 && uploadedForecasts.length === 0}>
                🚀 Start Analysis
              </button>
            </div>
          </div>
        )}

        {/* Data Visualization Section - Always visible for demo purposes */}
        <div className="visualization-section">
          <DataVisualization />
        </div>
      </div>
    </>
  )
}

export default App
