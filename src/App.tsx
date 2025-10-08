import { useState } from 'react'
import ContractUpload from './components/ContractUpload'
import ForecastUpload from './components/ForecastUpload'
import DataVisualization from './components/DataVisualization'
import './App.css'

interface AnalysisStep {
  id: string;
  name: string;
  description: string;
  duration: number; // in milliseconds
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 'contract-analysis',
    name: 'Analysing Contract',
    description: 'Reading and parsing contract documents',
    duration: 2000
  },
  {
    id: 'price-extraction',
    name: 'Extracting Price Structure',
    description: 'Identifying pricing models and terms',
    duration: 1500
  },
  {
    id: 'product-attribution',
    name: 'Attribuierung nach Produkttypen',
    description: 'Categorizing products into 4ML VIAL types',
    duration: 2500
  },
  {
    id: 'product-categories',
    name: 'Creating Product Categories',
    description: 'Organizing products by 4ML VIALS classification',
    duration: 1800
  },
  {
    id: 'forecast-analysis',
    name: 'Analysing Forecast Information',
    description: 'Processing forecast data and trends',
    duration: 2200
  },
  {
    id: 'volume-forecasting',
    name: 'Forecasting Product Volume per Month',
    description: 'Calculating monthly volume projections',
    duration: 3000
  },
  {
    id: 'price-aggregation',
    name: 'Aggregating Product Price',
    description: 'Consolidating pricing across all products',
    duration: 1700
  },
  {
    id: 'price-volume-mapping',
    name: 'Mapping Price to Volume',
    description: 'Creating price-volume correlation models',
    duration: 2800
  }
];

function App() {
  const [uploadedContracts, setUploadedContracts] = useState<File[]>([])
  const [uploadedForecasts, setUploadedForecasts] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleContractUpload = (file: File) => {
    console.log('Contract uploaded:', file.name)
    setUploadedContracts(prev => [...prev, file])
    // Reset analysis state when new files are uploaded
    setAnalysisComplete(false)
    setCompletedSteps(new Set())
  }

  const handleForecastUpload = (file: File) => {
    console.log('Forecast uploaded:', file.name)
    setUploadedForecasts(prev => [...prev, file])
    // Reset analysis state when new files are uploaded
    setAnalysisComplete(false)
    setCompletedSteps(new Set())
  }

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setCompletedSteps(new Set())

    for (let i = 0; i < analysisSteps.length; i++) {
      const step = analysisSteps[i]
      setCurrentStep(step.id)
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, step.duration))
      
      // Mark step as completed
      setCompletedSteps(prev => new Set([...prev, step.id]))
    }

    setCurrentStep('')
    setIsAnalyzing(false)
    setAnalysisComplete(true)
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
              <button 
                className="analyze-button" 
                disabled={uploadedContracts.length === 0 && uploadedForecasts.length === 0 || isAnalyzing}
                onClick={startAnalysis}
              >
                {isAnalyzing ? '⏳ Analyzing...' : '🚀 Start Analysis'}
              </button>
            </div>
          </div>
        )}

        {/* Analysis Progress Section */}
        {(isAnalyzing || analysisComplete) && (
          <div className="analysis-progress">
            <h3>
              {isAnalyzing ? 'Analysis in Progress' : 'Analysis Complete'}
              {isAnalyzing && <span className="spinner">⏳</span>}
            </h3>
            
            <div className="analysis-steps">
              {analysisSteps.map((step) => {
                const isCompleted = completedSteps.has(step.id)
                const isCurrent = currentStep === step.id
                
                return (
                  <div 
                    key={step.id} 
                    className={`analysis-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="step-indicator">
                      {isCompleted ? (
                        <span className="step-check">✅</span>
                      ) : isCurrent ? (
                        <span className="step-spinner spinner">⏳</span>
                      ) : (
                        <span className="step-pending">⏳</span>
                      )}
                    </div>
                    <div className="step-content">
                      <div className="step-name">{step.name}</div>
                      <div className="step-description">{step.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {analysisComplete && (
              <div className="analysis-complete">
                <div className="complete-message">
                  <span className="complete-icon">🎉</span>
                  <span>Analysis completed successfully! Results are shown below.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Visualization Section - Show only after analysis is complete or always for demo */}
        {(analysisComplete || (uploadedContracts.length === 0 && uploadedForecasts.length === 0)) && (
          <div className="visualization-section">
            <DataVisualization />
          </div>
        )}
      </div>
    </>
  )
}

export default App
