import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadZoneProps {
  onFileUpload: (files: FileList | null) => void;
}

export function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileUpload(e.dataTransfer.files);
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(e.target.files);
  }, [onFileUpload]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors hover:border-indigo-500"
    >
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-indigo-600 hover:text-indigo-500">Upload a file</span>
            <span className="text-gray-500"> or drag and drop</span>
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">CSV files up to 10MB</p>
      </div>
    </div>
  );
}