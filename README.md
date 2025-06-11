# File Uploader Challenge

A React TypeScript application with queue management for file uploads, built with Shopify Polaris UI components.

## ✨ Features

- **Drag & Drop Interface**: Intuitive file selection with drag and drop support
- **Queue Management**: Uploads maximum 3 files concurrently to prevent server overload
- **Progress Tracking**: Real-time progress bars for each file upload
- **Retry Logic**: Automatic retry on failure (max 3 attempts with 2-second delay)
- **File Preview**: Image thumbnails for uploaded files
- **Clean UI**: Built with Shopify Polaris for professional appearance
- **S3 Compatible**: Supports AWS S3, Digital Ocean Spaces, Backblaze, etc.
- **TypeScript**: Full type safety throughout the application

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Clean Architecture**: Separation of concerns with services, hooks, and components
- **Custom Hook**: `useFileUpload` manages upload state and queue operations
- **Upload Service**: Handles queue management, concurrency control, and retry logic
- **Polaris Components**: Professional UI components from Shopify

### Backend (Node.js + Express + TypeScript)
- **File Upload**: Multer middleware for handling multipart/form-data
- **S3 Integration**: AWS SDK for cloud storage (with local fallback)
- **Error Simulation**: 10% random failure rate for testing retry logic
- **CORS Enabled**: Cross-origin requests supported

### Key Components

1. **UploadService**: Core queue management with concurrency control
2. **FileDropzone**: Drag & drop interface using react-dropzone
3. **UploadQueueStatus**: Real-time queue statistics and controls
4. **FileList**: Display uploaded files with status and actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

3. **Start the development servers:**

Frontend (port 3000):
```bash
npm run dev
```

Backend (port 3001):
```bash
npm run server
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 🔧 Configuration

### S3 Setup (Optional)

Create `server/.env` file:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
PORT=3001
```

**Note**: If AWS credentials are not provided, the app will use mock S3 URLs for demonstration purposes.

### Supported Storage Providers
- AWS S3
- Digital Ocean Spaces
- Backblaze B2
- Any S3-compatible service

## 🧪 Testing the Queue

1. **Upload Multiple Files**: Drag 10+ files to see queue management in action
2. **Concurrent Limit**: Only 3 files upload simultaneously
3. **Retry Logic**: Some uploads will fail randomly and retry automatically
4. **Progress Tracking**: Watch real-time progress for each file

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── FileDropzone.tsx
│   │   ├── FileList.tsx
│   │   └── UploadQueueStatus.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useFileUpload.ts
│   ├── services/           # Business logic
│   │   └── uploadService.ts
│   ├── types/              # TypeScript definitions
│   │   └── upload.ts
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── server/
│   └── src/
│       └── server.ts       # Express server
├── package.json
└── README.md
```

## ⚡ Performance Considerations

- **Concurrency Control**: Prevents browser/server overload
- **Memory Management**: Uses memory storage for temporary file handling
- **Progress Tracking**: Efficient progress updates without blocking UI
- **Error Boundaries**: Graceful error handling and recovery

## 🔄 Trade-offs Made

1. **Memory vs Disk Storage**: Using memory storage for simplicity, but could be switched to disk for large files
2. **Retry Strategy**: Fixed delay vs exponential backoff (chose fixed for predictability)
3. **File Size Limit**: 50MB limit to prevent memory issues
4. **Mock S3 URLs**: For demo purposes when AWS credentials aren't provided

## ⏱️ Development Time

**Total Time**: ~45 minutes

- Project setup and configuration: 10 minutes
- Core upload service and queue logic: 15 minutes
- React components and UI: 15 minutes
- Backend server and S3 integration: 5 minutes

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend
```bash
cd server
npm run build
npm start
# Deploy to your Node.js hosting service
```

### Environment Variables for Production
Set the following in your hosting environment:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `PORT`

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite, Shopify Polaris
- **Backend**: Node.js, Express, TypeScript, Multer, AWS SDK
- **File Handling**: react-dropzone, FormData, multipart uploads
- **Build Tools**: Vite, ts-node-dev
- **Styling**: Shopify Polaris CSS

## 📝 License

This code is yours to use as specified in the challenge requirements.
# File-Uploader
