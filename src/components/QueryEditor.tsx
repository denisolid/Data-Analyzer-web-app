import React, { useState } from 'react';
import { Play, Save, AlertCircle } from 'lucide-react';
import { Connection, QueryExecutionResult } from '../types/connection';
import { executeQuery } from '../utils/connectionTester';
import { QueryResults } from './QueryResults';
import { QueryBuilder } from './QueryBuilder';

interface QueryEditorProps {
  connection: Connection;
}

export function QueryEditor({ connection }: QueryEditorProps) {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<QueryExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useBuilder, setUseBuilder] = useState(false);
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  const handleExecuteQuery = async () => {
    if (!query.trim()) return;

    setIsExecuting(true);
    setError(null);
    try {
      const result = await executeQuery(connection, query);
      setResult(result);
      if (!result.success) {
        setError(result.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveQuery = () => {
    if (query && !savedQueries.includes(query)) {
      setSavedQueries([...savedQueries, query]);
    }
  };

  const handleBuilderQueryChange = (builtQuery: string) => {
    setQuery(builtQuery);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setUseBuilder(!useBuilder)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              useBuilder
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {useBuilder ? 'Switch to Raw Query' : 'Use Query Builder'}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveQuery}
            disabled={!query.trim() || isExecuting}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Query
          </button>
          <button
            onClick={handleExecuteQuery}
            disabled={!query.trim() || isExecuting}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Play className="h-4 w-4 mr-1.5" />
            {isExecuting ? 'Executing...' : 'Run Query'}
          </button>
        </div>
      </div>

      {useBuilder ? (
        <QueryBuilder
          connection={connection}
          onQueryChange={handleBuilderQueryChange}
        />
      ) : (
        <div className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Enter your ${connection.type === 'mongodb' ? 'collection name' : 'SQL query'}...`}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            spellCheck="false"
          />

          {savedQueries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Queries</h4>
              <div className="space-y-2">
                {savedQueries.map((savedQuery, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(savedQuery)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    {savedQuery.length > 50 ? `${savedQuery.slice(0, 50)}...` : savedQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {result && <QueryResults result={result} />}
    </div>
  );
}