import { useState } from 'react'
import PdfUpload from './components/PdfUpload'
import './App.css'

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name)
    setUploadedFiles(prev => [...prev, file])
    // Here you would typically send the file to your server
    // or process it further
  }

  return (
    <>
      <div className="app-header">
        <h1>CMO Sales Projection</h1>
        <p>Upload your PDF documents for analysis</p>
      </div>
      
      <div className="main-content">
        <PdfUpload 
          onFileUpload={handleFileUpload}
          maxFileSize={15}
          multiple={true}
        />
        
        {uploadedFiles.length > 0 && (
          <div className="upload-summary">
            <h3>Processing Summary</h3>
            <p>{uploadedFiles.length} file(s) ready for analysis</p>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default App
