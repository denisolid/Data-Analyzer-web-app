import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, AlertCircle } from 'lucide-react';
import { Connection } from '../types/connection';
import { executeQuery } from '../utils/connectionTester';
import ChartDisplay from './ChartDisplay';

interface AnalysisPanelProps {
  connection: Connection;
}

export function AnalysisPanel({ connection }: AnalysisPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [analysisType, setAnalysisType] = useState<'schema' | 'data' | 'performance'>('schema');

  const fetchSchemaAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = '';
      if (connection.type === 'mysql') {
        query = `
          SELECT 
            TABLE_NAME as table_name,
            COLUMN_NAME as column_name,
            DATA_TYPE as data_type,
            CHARACTER_MAXIMUM_LENGTH as max_length,
            IS_NULLABLE as is_nullable
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = '${connection.database}'
        `;
      } else if (connection.type === 'mongodb') {
        // For MongoDB, we'll list collections
        query = 'admin';  // This will list collections
      }

      const result = await executeQuery(connection, query);
      if (result.success && result.rows) {
        setData(result.rows);
      } else {
        setError(result.error || 'Failed to fetch schema information');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze schema');
    } finally {
      setLoading(false);
    }
  };

  const fetchDataAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sample queries for data analysis
      let query = '';
      if (connection.type === 'mysql') {
        query = `
          SELECT 
            TABLE_NAME,
            TABLE_ROWS,
            DATA_LENGTH/1024/1024 as size_mb
          FROM information_schema.TABLES 
          WHERE TABLE_SCHEMA = '${connection.database}'
        `;
      } else if (connection.type === 'mongodb') {
        // For MongoDB, we'll use collection stats
        query = 'admin';  // We'll handle this differently in the backend
      }

      const result = await executeQuery(connection, query);
      if (result.success && result.rows) {
        setData(result.rows);
      } else {
        setError(result.error || 'Failed to fetch data analysis');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysisType === 'schema') {
      fetchSchemaAnalysis();
    } else if (analysisType === 'data') {
      fetchDataAnalysis();
    }
  }, [analysisType, connection]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Database Analysis</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setAnalysisType('schema')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                analysisType === 'schema'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Schema Analysis
            </button>
            <button
              onClick={() => setAnalysisType('data')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                analysisType === 'data'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Data Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <BarChart2 className="mx-auto h-8 w-8 text-gray-400 animate-pulse" />
            <p className="mt-2 text-sm text-gray-500">Analyzing database...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {analysisType === 'schema' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((value: any, j) => (
                          <td
                            key={j}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {value?.toString() || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {analysisType === 'data' && (
              <ChartDisplay
                data={data}
                title="Table Size Distribution"
                columns={Object.keys(data[0])}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}