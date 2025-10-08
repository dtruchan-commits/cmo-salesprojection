# Contract Upload Component

A React component specifically designed for uploading contract PDF files with drag-and-drop functionality, contract validation, and processing tracking for sales projection analysis.

## Features

- **Contract-Focused Interface**: Specialized UI and terminology for contract documents
- **Drag & Drop**: Users can drag contract PDF files directly onto the upload area
- **Contract Validation**: Validates file type (PDF contracts only) and file size limits
- **Processing Tracking**: Shows contract processing status with visual indicators
- **Multiple Contracts**: Supports uploading multiple contract PDFs simultaneously
- **Contract Management**: Users can remove uploaded contracts before analysis
- **Smart Contract Naming**: Automatically extracts and formats contract names from filenames
- **Responsive Design**: Optimized for desktop and mobile contract review workflows
- **Contract-Specific Styling**: Green-themed interface reflecting business/contract context

## Usage

```tsx
import ContractUpload from './components/ContractUpload';

function App() {
  const handleContractUpload = (file: File) => {
    console.log('Contract uploaded:', file.name);
    // Process the contract for sales projection analysis
  };

  return (
    <ContractUpload 
      onContractUpload={handleContractUpload}
      maxFileSize={15} // 15MB limit per contract
      multiple={true}  // Allow multiple contracts (default)
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onContractUpload` | `(file: File) => void` | `undefined` | Callback function called when a contract is successfully uploaded |
| `maxFileSize` | `number` | `10` | Maximum contract file size in MB |
| `accept` | `string` | `'.pdf'` | Accepted file types (PDF contracts) |
| `multiple` | `boolean` | `true` | Whether to allow multiple contract uploads |

## Contract Validation

The component validates:
- **File Type**: Only PDF contract files are accepted
- **File Size**: Contract files must be under the specified size limit
- **File Extension**: Checks both MIME type and file extension for PDF format

## Contract Processing Features

- **Automatic Contract Naming**: Extracts contract names from filenames and formats them properly
- **Upload Timestamps**: Tracks when each contract was uploaded with date and time
- **Processing Status**: Visual indicators for contract processing states (uploading, ready, failed)
- **Contract Organization**: Enhanced display showing contract names, file details, and metadata

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

---

# Forecast Upload Component

A React component specifically designed for uploading forecast Excel and CSV files with advanced file type detection, validation, and processing tracking for sales data analysis.

## Features

- **Excel & CSV Support**: Handles .xlsx, .xls, and .csv file formats
- **Advanced File Detection**: Recognizes different spreadsheet formats and displays appropriate icons
- **Sheet Count Detection**: For Excel files, displays the number of worksheets
- **Smart Forecast Naming**: Automatically extracts and formats forecast names from filenames
- **Drag & Drop**: Users can drag forecast files directly onto the upload area
- **File Size Validation**: Supports larger file sizes (25MB default) for complex forecasts
- **Processing Tracking**: Extended processing time simulation for data analysis
- **Responsive Blue Theme**: Distinct blue color scheme to differentiate from contract uploads

## Usage

```tsx
import ForecastUpload from './components/ForecastUpload';

function App() {
  const handleForecastUpload = (file: File) => {
    console.log('Forecast uploaded:', file.name);
    // Process the forecast for sales data analysis
  };

  return (
    <ForecastUpload 
      onForecastUpload={handleForecastUpload}
      maxFileSize={25} // 25MB limit for Excel files
      multiple={true}  // Allow multiple forecasts (default)
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onForecastUpload` | `(file: File) => void` | `undefined` | Callback function called when a forecast is successfully uploaded |
| `maxFileSize` | `number` | `25` | Maximum forecast file size in MB |
| `accept` | `string` | `'.xlsx,.xls,.csv'` | Accepted file types |
| `multiple` | `boolean` | `true` | Whether to allow multiple forecast uploads |

## Forecast File Support

- **Excel Workbooks (.xlsx)**: Modern Excel format with multiple worksheet support
- **Legacy Excel (.xls)**: Older Excel format support
- **CSV Files (.csv)**: Comma-separated values for simple data import

## Processing Features

- **File Type Recognition**: Different icons and labels for Excel vs CSV files
- **Metadata Display**: Shows file size, type, sheet count, and upload timestamp
- **Processing Simulation**: Longer processing time to simulate complex data analysis
- **Visual Status Indicators**: Processing, success, and error states with appropriate styling