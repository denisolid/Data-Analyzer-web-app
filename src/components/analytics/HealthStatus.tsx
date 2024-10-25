import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { DatabaseHealth } from '../../types/analytics';

interface HealthStatusProps {
  health: DatabaseHealth;
}

export function HealthStatus({ health }: HealthStatusProps) {
  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'text-green-800 bg-green-50';
      case 'warning':
        return 'text-yellow-800 bg-yellow-50';
      case 'critical':
        return 'text-red-800 bg-red-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">System Health</h3>
          <span className="text-sm text-gray-500">
            Last checked: {new Date(health.lastCheck).toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h4 className="text-lg font-medium capitalize">{health.status}</h4>
            <p className="text-sm text-gray-500">
              {health.issues.length} active {health.issues.length === 1 ? 'issue' : 'issues'}
            </p>
          </div>
        </div>

        {health.issues.length > 0 && (
          <div className="mt-6 space-y-4">
            {health.issues.map((issue, index) => (
              <div
                key={index}
                className={`p-4 rounded-md ${
                  issue.severity === 'high'
                    ? 'bg-red-50'
                    : issue.severity === 'medium'
                    ? 'bg-yellow-50'
                    : 'bg-blue-50'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {issue.severity === 'high' ? (
                      <XCircle className="h-5 w-5 text-red-400" />
                    ) : issue.severity === 'medium' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      issue.severity === 'high'
                        ? 'text-red-800'
                        : issue.severity === 'medium'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}>
                      {issue.message}
                    </h3>
                    <div className="mt-2 text-sm">
                      <p className={
                        issue.severity === 'high'
                          ? 'text-red-700'
                          : issue.severity === 'medium'
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }>
                        {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}