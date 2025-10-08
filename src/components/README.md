# PDF Upload Component

A React component for uploading PDF files with drag-and-drop functionality, file validation, and progress tracking.

## Features

- **Drag & Drop**: Users can drag PDF files directly onto the upload area
- **File Validation**: Validates file type (PDF only) and file size limits
- **Progress Tracking**: Shows upload status with visual indicators
- **Multiple Files**: Supports uploading multiple PDFs at once
- **File Management**: Users can remove uploaded files before processing
- **Responsive Design**: Works well on desktop and mobile devices
- **Accessibility**: Keyboard navigation and screen reader friendly

## Usage

```tsx
import PdfUpload from './components/PdfUpload';

function App() {
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Process the file here
  };

  return (
    <PdfUpload 
      onFileUpload={handleFileUpload}
      maxFileSize={15} // 15MB limit
      multiple={true}  // Allow multiple files
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFileUpload` | `(file: File) => void` | `undefined` | Callback function called when a file is successfully uploaded |
| `maxFileSize` | `number` | `10` | Maximum file size in MB |
| `accept` | `string` | `'.pdf'` | Accepted file types |
| `multiple` | `boolean` | `false` | Whether to allow multiple file uploads |

## File Validation

The component validates:
- **File Type**: Only PDF files are accepted
- **File Size**: Files must be under the specified size limit
- **File Extension**: Checks both MIME type and file extension

## Styling

The component comes with comprehensive CSS styling that includes:
- Hover effects and animations
- Drag-over visual feedback
- Loading states and progress indicators
- Error message styling
- Responsive design for mobile devices

## Integration Notes

This component is designed to work with the CMO Sales Projection application but can be easily adapted for other projects. The uploaded files are handled through the `onFileUpload` callback, where you can:

1. Send files to your server for processing
2. Store file references in your application state
3. Display file contents or metadata
4. Process PDFs for analysis or data extraction

## Browser Support

- Modern browsers with HTML5 File API support
- Drag and drop functionality requires modern browsers
- Mobile browsers with touch support