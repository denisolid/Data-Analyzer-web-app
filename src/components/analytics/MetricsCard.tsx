import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
}

export function MetricsCard({ title, value, icon, trend }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`ml-2 flex items-baseline text-sm ${
                trend.direction === 'up' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                )}
                {trend.value}%
                <span className="ml-1 text-gray-500">{trend.label}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}