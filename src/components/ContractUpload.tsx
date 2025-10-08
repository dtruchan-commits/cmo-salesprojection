import React, { useState, useRef } from 'react';
import './ContractUpload.css';

interface ContractUploadProps {
  onContractUpload?: (file: File) => void;
  maxFileSize?: number; // in MB
  accept?: string;
  multiple?: boolean;
}

interface UploadedContract {
  file: File;
  id: string;
  uploadDate: Date;
  status: 'uploading' | 'success' | 'error';
  contractName?: string;
}

const ContractUpload: React.FC<ContractUploadProps> = ({
  onContractUpload,
  maxFileSize = 10, // 10MB default
  accept = '.pdf',
  multiple = true // Default to true for contracts
}) => {
  const [uploadedContracts, setUploadedContracts] = useState<UploadedContract[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateContract = (file: File): string | null => {
    // Check file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Please select a PDF contract file';
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `Contract file size exceeds ${maxFileSize}MB limit`;
    }

    return null;
  };

  const processContract = (file: File) => {
    const validationError = validateContract(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Extract contract name from filename (remove .pdf extension and clean up)
    const contractName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    const newContract: UploadedContract = {
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadDate: new Date(),
      status: 'uploading',
      contractName
    };

    setUploadedContracts(prev => [...prev, newContract]);
    setError('');

    // Simulate contract processing
    setTimeout(() => {
      setUploadedContracts(prev =>
        prev.map(contract =>
          contract.id === newContract.id ? { ...contract, status: 'success' } : contract
        )
      );
      onContractUpload?.(file);
    }, 1500); // Slightly longer for contract processing
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(processContract);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    Array.from(files).forEach(processContract);
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

  const removeContract = (id: string) => {
    setUploadedContracts(prev => prev.filter(contract => contract.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="contract-upload-container">
      <div
        className={`contract-upload-area ${isDragOver ? 'drag-over' : ''}`}
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
            <path d="M9 12h6"/>
            <path d="M12 9v6"/>
          </svg>
        </div>
        
        <div className="upload-text">
          <h3>Upload Contract Documents</h3>
          <p>Drag and drop your contract PDF files here, or click to browse</p>
          <p className="upload-limit">Maximum file size: {maxFileSize}MB per contract</p>
          <p className="file-types">Supported format: PDF contracts only</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {uploadedContracts.length > 0 && (
        <div className="uploaded-contracts">
          <h4>Contract Files ({uploadedContracts.length})</h4>
          {uploadedContracts.map((uploadedContract) => (
            <div key={uploadedContract.id} className="contract-item">
              <div className="contract-info">
                <div className="contract-icon">📋</div>
                <div className="contract-details">
                  <div className="contract-name">{uploadedContract.contractName}</div>
                  <div className="contract-meta">
                    {formatFileSize(uploadedContract.file.size)} • 
                    Uploaded {uploadedContract.uploadDate.toLocaleDateString()} • 
                    {uploadedContract.uploadDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="file-name">{uploadedContract.file.name}</div>
                </div>
              </div>
              
              <div className="contract-actions">
                {uploadedContract.status === 'uploading' && (
                  <div className="processing-status">
                    <div className="loading-spinner">⏳</div>
                    <span className="status-text">Processing...</span>
                  </div>
                )}
                {uploadedContract.status === 'success' && (
                  <div className="success-status">
                    <div className="success-icon">✅</div>
                    <span className="status-text">Ready</span>
                  </div>
                )}
                {uploadedContract.status === 'error' && (
                  <div className="error-status">
                    <div className="error-icon">❌</div>
                    <span className="status-text">Failed</span>
                  </div>
                )}
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeContract(uploadedContract.id);
                  }}
                  title="Remove contract"
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

export default ContractUpload;