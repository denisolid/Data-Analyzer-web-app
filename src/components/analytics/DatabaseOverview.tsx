import React from 'react';
import { BarChart2, Database, Clock, AlertTriangle, HardDrive, Activity } from 'lucide-react';
import { DatabaseAnalytics } from '../../types/analytics';
import { formatBytes, formatDuration, formatNumber } from '../../utils/formatters';
import { MetricsCard } from './MetricsCard';
import { PerformanceGraph } from './PerformanceGraph';
import { HealthStatus } from './HealthStatus';
import { TablesList } from './TablesList';

interface DatabaseOverviewProps {
  analytics: DatabaseAnalytics;
  onRefresh: () => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function DatabaseOverview({
  analytics,
  onRefresh,
  timeRange,
  onTimeRangeChange
}: DatabaseOverviewProps) {
  const {
    currentMetrics,
    performanceHistory,
    tableMetrics,
    health,
    backup
  } = analytics;

  return (
    <div className="space-y-6">
      {/* Header with key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Database Size"
          value={formatBytes(currentMetrics.size)}
          icon={<Database className="h-5 w-5 text-indigo-500" />}
          trend={{
            value: 5.2,
            label: 'from last week',
            direction: 'up'
          }}
        />
        <MetricsCard
          title="Active Connections"
          value={currentMetrics.activeConnections}
          icon={<Activity className="h-5 w-5 text-green-500" />}
          trend={{
            value: -2,
            label: 'from last hour',
            direction: 'down'
          }}
        />
        <MetricsCard
          title="Avg Response Time"
          value={`${currentMetrics.queryResponseTime}ms`}
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          trend={{
            value: 12,
            label: 'from last hour',
            direction: 'up'
          }}
        />
        <MetricsCard
          title="Storage Usage"
          value={`${currentMetrics.size / 1024 / 1024}GB`}
          icon={<HardDrive className="h-5 w-5 text-purple-500" />}
          trend={{
            value: 8,
            label: 'from last month',
            direction: 'up'
          }}
        />
      </div>

      {/* Performance Graph */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <BarChart2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <PerformanceGraph data={performanceHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Status */}
        <div className="lg:col-span-1">
          <HealthStatus health={health} />
        </div>

        {/* Tables List */}
        <div className="lg:col-span-2">
          <TablesList tables={tableMetrics} />
        </div>
      </div>

      {/* Backup Status */}
      {backup.status === 'failed' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Backup Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                Last backup attempt failed. Please check the backup configuration and ensure proper permissions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}