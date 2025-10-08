import React, { useState, useRef } from 'react';
import './ForecastUpload.css';

interface ForecastUploadProps {
  onForecastUpload?: (file: File) => void;
  maxFileSize?: number; // in MB
  accept?: string;
  multiple?: boolean;
}

interface UploadedForecast {
  file: File;
  id: string;
  uploadDate: Date;
  status: 'uploading' | 'success' | 'error';
  forecastName?: string;
  sheetCount?: number;
}

const ForecastUpload: React.FC<ForecastUploadProps> = ({
  onForecastUpload,
  maxFileSize = 25, // 25MB default for Excel files
  accept = '.xlsx,.xls,.csv',
  multiple = true // Default to true for forecasts
}) => {
  const [uploadedForecasts, setUploadedForecasts] = useState<UploadedForecast[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForecast = (file: File): string | null => {
    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv'
    ];
    
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return 'Please select an Excel file (.xlsx, .xls) or CSV file';
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `Forecast file size exceeds ${maxFileSize}MB limit`;
    }

    return null;
  };

  const processForecast = (file: File) => {
    const validationError = validateForecast(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Extract forecast name from filename and clean it up
    const forecastName = file.name
      .replace(/\.(xlsx|xls|csv)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase()); // Title case

    const newForecast: UploadedForecast = {
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadDate: new Date(),
      status: 'uploading',
      forecastName,
      sheetCount: file.name.toLowerCase().endsWith('.csv') ? 1 : undefined // CSV has 1 sheet, Excel might have multiple
    };

    setUploadedForecasts(prev => [...prev, newForecast]);
    setError('');

    // Simulate forecast processing with analysis
    setTimeout(() => {
      setUploadedForecasts(prev =>
        prev.map(forecast =>
          forecast.id === newForecast.id 
            ? { 
                ...forecast, 
                status: 'success',
                sheetCount: forecast.sheetCount || Math.floor(Math.random() * 5) + 1 // Random sheet count for demo
              } 
            : forecast
        )
      );
      onForecastUpload?.(file);
    }, 2000); // Longer processing time for Excel analysis
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(processForecast);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    Array.from(files).forEach(processForecast);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeForecast = (id: string) => {
    setUploadedForecasts(prev => prev.filter(forecast => forecast.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (filename: string): string => {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    switch (extension) {
      case '.xlsx':
      case '.xls':
        return '📊';
      case '.csv':
        return '📈';
      default:
        return '📋';
    }
  };

  const getFileTypeLabel = (filename: string): string => {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    switch (extension) {
      case '.xlsx':
        return 'Excel Workbook';
      case '.xls':
        return 'Excel Legacy';
      case '.csv':
        return 'CSV Data';
      default:
        return 'Spreadsheet';
    }
  };

  return (
    <div className="forecast-upload-container">
      <div
        className={`forecast-upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18V3H3z"/>
            <path d="M7 7h10"/>
            <path d="M7 11h10"/>
            <path d="M7 15h6"/>
            <rect x="3" y="3" width="18" height="4"/>
          </svg>
        </div>
        
        <div className="upload-text">
          <h3>Upload Forecast Files</h3>
          <p>Drag and drop your forecast Excel or CSV files here, or click to browse</p>
          <p className="upload-limit">Maximum file size: {maxFileSize}MB per forecast</p>
          <p className="file-types">Supported formats: Excel (.xlsx, .xls), CSV (.csv)</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {uploadedForecasts.length > 0 && (
        <div className="uploaded-forecasts">
          <h4>Forecast Files ({uploadedForecasts.length})</h4>
          {uploadedForecasts.map((uploadedForecast) => (
            <div key={uploadedForecast.id} className="forecast-item">
              <div className="forecast-info">
                <div className="forecast-icon">{getFileTypeIcon(uploadedForecast.file.name)}</div>
                <div className="forecast-details">
                  <div className="forecast-name">{uploadedForecast.forecastName}</div>
                  <div className="forecast-meta">
                    {formatFileSize(uploadedForecast.file.size)} • 
                    {getFileTypeLabel(uploadedForecast.file.name)} • 
                    {uploadedForecast.sheetCount && `${uploadedForecast.sheetCount} sheet${uploadedForecast.sheetCount > 1 ? 's' : ''} • `}
                    Uploaded {uploadedForecast.uploadDate.toLocaleDateString()} • 
                    {uploadedForecast.uploadDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="file-name">{uploadedForecast.file.name}</div>
                </div>
              </div>
              
              <div className="forecast-actions">
                {uploadedForecast.status === 'uploading' && (
                  <div className="processing-status">
                    <div className="loading-spinner">⏳</div>
                    <span className="status-text">Analyzing...</span>
                  </div>
                )}
                {uploadedForecast.status === 'success' && (
                  <div className="success-status">
                    <div className="success-icon">✅</div>
                    <span className="status-text">Ready</span>
                  </div>
                )}
                {uploadedForecast.status === 'error' && (
                  <div className="error-status">
                    <div className="error-icon">❌</div>
                    <span className="status-text">Failed</span>
                  </div>
                )}
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeForecast(uploadedForecast.id);
                  }}
                  title="Remove forecast"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForecastUpload;