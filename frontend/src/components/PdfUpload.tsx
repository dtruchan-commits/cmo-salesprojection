import React, { useState, useRef } from 'react';
import './PdfUpload.css';

interface PdfUploadProps {
  onFileUpload?: (file: File) => void;
  maxFileSize?: number; // in MB
  accept?: string;
  multiple?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  uploadDate: Date;
  status: 'uploading' | 'success' | 'error';
}

const PdfUpload: React.FC<PdfUploadProps> = ({
  onFileUpload,
  maxFileSize = 10, // 10MB default
  accept = '.pdf',
  multiple = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Please select a PDF file';
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newFile: UploadedFile = {
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      uploadDate: new Date(),
      status: 'uploading'
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setError('');

    // Simulate upload process
    setTimeout(() => {
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === newFile.id ? { ...f, status: 'success' } : f
        )
      );
      onFileUpload?.(file);
    }, 1000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(processFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    Array.from(files).forEach(processFile);
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

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="pdf-upload-container">
      <div
        className={`pdf-upload-area ${isDragOver ? 'drag-over' : ''}`}
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
          </svg>
        </div>
        
        <div className="upload-text">
          <h3>Upload PDF Files</h3>
          <p>Drag and drop your PDF files here, or click to browse</p>
          <p className="upload-limit">Maximum file size: {maxFileSize}MB</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files</h4>
          {uploadedFiles.map((uploadedFile) => (
            <div key={uploadedFile.id} className="file-item">
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <div className="file-name">{uploadedFile.file.name}</div>
                  <div className="file-meta">
                    {formatFileSize(uploadedFile.file.size)} • {uploadedFile.uploadDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="file-actions">
                {uploadedFile.status === 'uploading' && (
                  <div className="loading-spinner">⏳</div>
                )}
                {uploadedFile.status === 'success' && (
                  <div className="success-icon">✅</div>
                )}
                {uploadedFile.status === 'error' && (
                  <div className="error-icon">❌</div>
                )}
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(uploadedFile.id);
                  }}
                  title="Remove file"
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

export default PdfUpload;