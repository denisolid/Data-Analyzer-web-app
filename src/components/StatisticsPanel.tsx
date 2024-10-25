import React from 'react';
import { FileText } from 'lucide-react';
import { ColumnStats } from '../utils/dataProcessor';

interface StatisticsPanelProps {
  stats: ColumnStats[];
  analysisType: string;
}

export function StatisticsPanel({ stats, analysisType }: StatisticsPanelProps) {
  const getRelevantStats = () => {
    switch (analysisType) {
      case 'sales':
        return stats.filter(stat => 
          stat.name.toLowerCase().includes('revenue') ||
          stat.name.toLowerCase().includes('sales') ||
          stat.name.toLowerCase().includes('order')
        );
      case 'traffic':
        return stats.filter(stat => 
          stat.name.toLowerCase().includes('visitor') ||
          stat.name.toLowerCase().includes('view') ||
          stat.name.toLowerCase().includes('traffic')
        );
      case 'performance':
        return stats.filter(stat => 
          stat.name.toLowerCase().includes('time') ||
          stat.name.toLowerCase().includes('rate') ||
          stat.name.toLowerCase().includes('performance')
        );
      default:
        return stats;
    }
  };

  const relevantStats = getRelevantStats();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Statistics Overview</h2>
      </div>
      <div className="space-y-4">
        {relevantStats.map((stat, index) => (
          <div key={index} className="border-b pb-4">
            <h3 className="font-medium text-gray-900">{stat.name}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
              <div>Type: {stat.type}</div>
              <div>Unique Values: {stat.unique}</div>
              <div>Missing Values: {stat.missing}</div>
              {stat.type === 'number' && (
                <>
                  <div>Min: {stat.min?.toLocaleString()}</div>
                  <div>Max: {stat.max?.toLocaleString()}</div>
                  <div>Mean: {stat.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  {stat.median && <div>Median: {stat.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>}
                  {stat.standardDeviation && (
                    <div>Std Dev: {stat.standardDeviation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}