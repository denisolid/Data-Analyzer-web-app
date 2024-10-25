import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { analyzeData } from '../utils/dataProcessor';
import { Toast } from './Toast';
import { FileUploadZone } from './FileUploadZone';

interface FileUploadProps {
  onDataLoaded: (data: string[][], stats: any[]) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      const text = await file.text();
      const rows = text.split('\n').map(row => 
        row.split(',').map(cell => cell.trim())
      );

      if (rows.length < 2) {
        throw new Error('File appears to be empty or invalid');
      }

      const stats = analyzeData(rows);
      onDataLoaded(rows, stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  return (
    <div className="relative">
      <FileUploadZone onFileUpload={handleFileUpload} />

      {error && (
        <div className="mt-4">
          <Toast
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Data Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Sales Data', description: 'Revenue, products, dates' },
            { name: 'Website Traffic', description: 'Visitors, pages, sources' },
            { name: 'Product Metrics', description: 'Usage, retention, engagement' }
          ].map((template, index) => (
            <button
              key={index}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              onClick={() => {/* TODO: Load template data */}}
            >
              <FileText className="h-5 w-5 text-gray-400 mr-3" />
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-900">{template.name}</h5>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}