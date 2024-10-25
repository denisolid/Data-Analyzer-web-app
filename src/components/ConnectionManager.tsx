import React, { useState } from 'react';
import { Database, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Connection, ConnectionTestResult } from '../types/connection';
import { testConnection } from '../utils/connectionTester';
import { ConnectionForm } from './ConnectionForm';
import { Toast } from './Toast';
import { QueryEditor } from './QueryEditor';
import { AnalysisPanel } from './AnalysisPanel';

export default function ConnectionManager() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState<'query' | 'analysis'>('query');

  const handleAddConnection = (newConnection: Connection) => {
    setConnections([...connections, newConnection]);
    setIsAddingNew(false);
    setToast({
      message: 'Connection added successfully',
      type: 'success'
    });
  };

  const handleDeleteConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
    if (selectedConnection?.id === id) {
      setSelectedConnection(null);
    }
    setToast({
      message: 'Connection removed',
      type: 'success'
    });
  };

  const handleTestConnection = async (connection: Connection) => {
    setTesting(connection.id);
    try {
      const result = await testConnection(connection);
      if (result.success) {
        setToast({
          message: result.message || 'Connection successful!',
          type: 'success'
        });
        setSelectedConnection(connection);
      } else {
        setToast({
          message: result.message || 'Connection failed',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        message: 'Connection failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error'
      });
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Database Connections</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </button>
      </div>

      {isAddingNew && (
        <ConnectionForm
          onSubmit={handleAddConnection}
          onCancel={() => setIsAddingNew(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4">
            {connections.map(connection => (
              <div 
                key={connection.id} 
                className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-colors ${
                  selectedConnection?.id === connection.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedConnection(connection)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-500">
                        {connection.type} • {connection.host}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestConnection(connection);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-500"
                      disabled={testing === connection.id}
                    >
                      <RefreshCw className={`h-5 w-5 ${testing === connection.id ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConnection(connection.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {connections.length === 0 && !isAddingNew && (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <Database className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No connections</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new database connection.</p>
              </div>
            )}
          </div>
        </div>

        {selectedConnection && (
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('query')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'query'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Query Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'analysis'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Database Analysis
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'query' ? (
                  <QueryEditor connection={selectedConnection} />
                ) : (
                  <AnalysisPanel connection={selectedConnection} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}