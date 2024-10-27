import React, { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { analyzeData } from "../utils/dataProcessor";
import { Toast } from "./Toast";
import { FileUploadZone } from "./FileUploadZone";

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
      if (!file.name.endsWith(".csv")) {
        throw new Error("Please upload a CSV file");
      }

      const text = await file.text();
      const rows = text
        .split("\n")
        .map((row) => row.split(",").map((cell) => cell.trim()));

      if (rows.length < 2) {
        throw new Error("File appears to be empty or invalid");
      }

      const stats = analyzeData(rows);
      onDataLoaded(rows, stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
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
      {error && (
        <div className="mt-4">
          <Toast message={error} type="error" onClose={() => setError(null)} />
        </div>
      )}
    </div>
  );
}
