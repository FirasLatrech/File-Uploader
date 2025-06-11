import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UploadFile, UploadStatus, UploadQueueConfig } from '../types/upload';
import { UploadService } from '../services/uploadService';

const DEFAULT_CONFIG: UploadQueueConfig = {
  maxConcurrent: 3,
  maxRetries: 3,
  retryDelay: 2000,
};

export const useFileUpload = (config: UploadQueueConfig = DEFAULT_CONFIG) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [queueStatus, setQueueStatus] = useState({
    total: 0,
    pending: 0,
    uploading: 0,
    completed: 0,
    failed: 0,
    retrying: 0,
  });

  const uploadServiceRef = useRef<UploadService | null>(null);

  // Initialize upload service
  useEffect(() => {
    uploadServiceRef.current = new UploadService(config);

    // Set up callbacks
    uploadServiceRef.current.setProgressCallback((file: UploadFile) => {
      setFiles(prev => prev.map(f => f.id === file.id ? { ...file } : f));
    });

    uploadServiceRef.current.setStatusChangeCallback((file: UploadFile) => {
      setFiles(prev => prev.map(f => f.id === file.id ? { ...file } : f));
      setQueueStatus(uploadServiceRef.current!.getQueueStatus());
    });
  }, [config]);

  const addFiles = useCallback((newFiles: File[]) => {
    if (!uploadServiceRef.current) return;

    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: uuidv4(),
      file,
      status: UploadStatus.PENDING,
      progress: 0,
      retryCount: 0,
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
    uploadServiceRef.current.addFiles(uploadFiles);
    setQueueStatus(uploadServiceRef.current.getQueueStatus());
  }, []);

  const retryFailedFiles = useCallback(() => {
    if (!uploadServiceRef.current) return;
    uploadServiceRef.current.retryFailedFiles();
    setFiles(uploadServiceRef.current.getFiles());
    setQueueStatus(uploadServiceRef.current.getQueueStatus());
  }, []);

  const clearCompleted = useCallback(() => {
    if (!uploadServiceRef.current) return;
    uploadServiceRef.current.clearCompleted();
    setFiles(uploadServiceRef.current.getFiles());
    setQueueStatus(uploadServiceRef.current.getQueueStatus());
  }, []);

  const removeFile = useCallback((fileId: string) => {
    if (!uploadServiceRef.current) return;
    uploadServiceRef.current.removeFile(fileId);
    setFiles(uploadServiceRef.current.getFiles());
    setQueueStatus(uploadServiceRef.current.getQueueStatus());
  }, []);

  const getStatusColor = useCallback((status: UploadStatus) => {
    switch (status) {
      case UploadStatus.PENDING:
        return 'subdued';
      case UploadStatus.UPLOADING:
        return 'highlight';
      case UploadStatus.COMPLETED:
        return 'success';
      case UploadStatus.FAILED:
        return 'critical';
      case UploadStatus.RETRYING:
        return 'warning';
      default:
        return 'subdued';
    }
  }, []);

  const getStatusText = useCallback((status: UploadStatus) => {
    switch (status) {
      case UploadStatus.PENDING:
        return 'Pending';
      case UploadStatus.UPLOADING:
        return 'Uploading';
      case UploadStatus.COMPLETED:
        return 'Completed';
      case UploadStatus.FAILED:
        return 'Failed';
      case UploadStatus.RETRYING:
        return 'Retrying';
      default:
        return 'Unknown';
    }
  }, []);

  return {
    files,
    queueStatus,
    addFiles,
    retryFailedFiles,
    clearCompleted,
    removeFile,
    getStatusColor,
    getStatusText,
  };
};
