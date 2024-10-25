import React, { useState } from 'react';
import { Database, HelpCircle } from 'lucide-react';
import { Connection } from '../types/connection';
import { validateMongoDBConnectionString } from '../utils/validators';
import { parseMongoDBConnectionString } from '../utils/connectionParser';
import { Toast } from './Toast';

interface ConnectionFormProps {
  onSubmit: (connection: Connection) => void;
  onCancel: () => void;
}

export function ConnectionForm({ onSubmit, onCancel }: ConnectionFormProps) {
  const [formData, setFormData] = useState<Partial<Connection>>({
    type: 'mongodb',
    port: '',
  });
  const [showConnectionString, setShowConnectionString] = useState(true);
  const [connectionString, setConnectionString] = useState('mongodb+srv://denys:12lo48KK@cluster0.x6gcn.mongodb.net/');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (showConnectionString && connectionString) {
        if (!validateMongoDBConnectionString(connectionString)) {
          setError('Invalid MongoDB connection string format');
          return;
        }

        const parsedConnection = parseMongoDBConnectionString(connectionString);
        if (formData.name) {
          onSubmit({
            id: Date.now().toString(),
            name: formData.name,
            ...parsedConnection
          } as Connection);
        } else {
          setError('Connection name is required');
        }
      } else if (formData.name && formData.host && formData.database && formData.username) {
        onSubmit({
          id: Date.now().toString(),
          name: formData.name,
          type: formData.type || 'mongodb',
          host: formData.host,
          port: formData.port || '27017',
          database: formData.database,
          username: formData.username,
          password: formData.password,
          options: {
            ssl: formData.options?.ssl || false,
            useConnectionString: true
          }
        });
      } else {
        setError('Please fill in all required fields');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Add MongoDB Connection</h3>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Toast
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Connection Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.name || ''}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., MongoDB Atlas Production"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Connection String</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              required
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
              value={connectionString}
              onChange={e => setConnectionString(e.target.value)}
              placeholder="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <HelpCircle className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Your MongoDB Atlas connection string
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Connection
        </button>
      </div>
    </form>
  );
}