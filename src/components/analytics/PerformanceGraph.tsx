import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { PerformanceMetrics } from '../../types/analytics';

interface PerformanceGraphProps {
  data: PerformanceMetrics[];
}

export function PerformanceGraph({ data }: PerformanceGraphProps) {
  const formattedData = useMemo(() => {
    return data.map(metric => ({
      ...metric,
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
      cpu: Math.round(metric.cpu * 100) / 100,
      memory: Math.round(metric.memory * 100) / 100,
      diskUsage: Math.round(metric.diskUsage * 100) / 100,
    }));
  }, [data]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="cpu" 
            stroke="#4f46e5" 
            name="CPU (%)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="memory" 
            stroke="#06b6d4" 
            name="Memory (%)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="diskUsage" 
            stroke="#8b5cf6" 
            name="Disk Usage (%)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}