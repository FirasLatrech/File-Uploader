import axios, { AxiosProgressEvent } from 'axios';
import { UploadFile, UploadStatus, UploadQueueConfig, UploadResponse } from '../types/upload';

export class UploadService {
  private queue: UploadFile[] = [];
  private activeUploads: Set<string> = new Set();
  private config: UploadQueueConfig;
  private onProgressCallback?: (file: UploadFile) => void;
  private onStatusChangeCallback?: (file: UploadFile) => void;

  constructor(config: UploadQueueConfig) {
    this.config = config;
  }

  setProgressCallback(callback: (file: UploadFile) => void) {
    this.onProgressCallback = callback;
  }

  setStatusChangeCallback(callback: (file: UploadFile) => void) {
    this.onStatusChangeCallback = callback;
  }

  addFiles(files: UploadFile[]) {
    this.queue.push(...files);
    this.processQueue();
  }

  private async processQueue() {
    // Process queue while there are pending files and we haven't reached max concurrent uploads
    while (
      this.queue.some(f => f.status === UploadStatus.PENDING) &&
      this.activeUploads.size < this.config.maxConcurrent
    ) {
      const nextFile = this.queue.find(f => f.status === UploadStatus.PENDING);
      if (nextFile) {
        this.uploadFile(nextFile);
      }
    }
  }

  private async uploadFile(uploadFile: UploadFile) {
    this.activeUploads.add(uploadFile.id);
    uploadFile.status = UploadStatus.UPLOADING;
    this.notifyStatusChange(uploadFile);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);

      const response = await axios.post<UploadResponse>('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            uploadFile.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.notifyProgress(uploadFile);
          }
        },
      });

      if (response.data.success) {
        uploadFile.status = UploadStatus.COMPLETED;
        uploadFile.url = response.data.url;
        uploadFile.progress = 100;
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      uploadFile.error = error instanceof Error ? error.message : 'Unknown error';

      if (uploadFile.retryCount < this.config.maxRetries) {
        uploadFile.retryCount++;
        uploadFile.status = UploadStatus.RETRYING;
        this.notifyStatusChange(uploadFile);

        // Retry after delay
        setTimeout(() => {
          uploadFile.status = UploadStatus.PENDING;
          uploadFile.progress = 0;
          this.activeUploads.delete(uploadFile.id);
          this.processQueue();
        }, this.config.retryDelay);
        return;
      } else {
        uploadFile.status = UploadStatus.FAILED;
      }
    }

    this.activeUploads.delete(uploadFile.id);
    this.notifyStatusChange(uploadFile);

    // Continue processing queue
    this.processQueue();
  }

  private notifyProgress(file: UploadFile) {
    if (this.onProgressCallback) {
      this.onProgressCallback(file);
    }
  }

  private notifyStatusChange(file: UploadFile) {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(file);
    }
  }

  getQueueStatus() {
    return {
      total: this.queue.length,
      pending: this.queue.filter(f => f.status === UploadStatus.PENDING).length,
      uploading: this.queue.filter(f => f.status === UploadStatus.UPLOADING).length,
      completed: this.queue.filter(f => f.status === UploadStatus.COMPLETED).length,
      failed: this.queue.filter(f => f.status === UploadStatus.FAILED).length,
      retrying: this.queue.filter(f => f.status === UploadStatus.RETRYING).length,
    };
  }

  getFiles() {
    return [...this.queue];
  }

  retryFailedFiles() {
    const failedFiles = this.queue.filter(f => f.status === UploadStatus.FAILED);
    failedFiles.forEach(file => {
      file.status = UploadStatus.PENDING;
      file.progress = 0;
      file.retryCount = 0;
      file.error = undefined;
    });
    this.processQueue();
  }

  clearCompleted() {
    this.queue = this.queue.filter(f => f.status !== UploadStatus.COMPLETED);
  }

  removeFile(fileId: string) {
    const index = this.queue.findIndex(f => f.id === fileId);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }
}
