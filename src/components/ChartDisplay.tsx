import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';

interface ChartDisplayProps {
  data: Record<string, any>[];
  title: string;
  columns: string[];
  defaultMetric?: string;
  onMetricChange?: (metric: string) => void;
}

const COLORS = ['#4f46e5', '#7c3aed', '#2563eb', '#3b82f6', '#06b6d4', '#0891b2', '#0d9488'];

export default function ChartDisplay({ 
  data = [], 
  title, 
  columns = [],
  defaultMetric,
  onMetricChange 
}: ChartDisplayProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedMetric, setSelectedMetric] = useState<string>(defaultMetric || '');
  const [groupBy, setGroupBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [aggregationType, setAggregationType] = useState<'sum' | 'average' | 'count'>('sum');

  const availableColumns = useMemo(() => {
    if (!data?.length) return { numeric: [], categorical: [] };
    
    const numeric: string[] = [];
    const categorical: string[] = [];
    
    Object.entries(data[0] || {}).forEach(([key, value]) => {
      if (typeof value === 'number' || !isNaN(Number(value))) {
        numeric.push(key);
      } else {
        categorical.push(key);
      }
    });
    
    return { numeric, categorical };
  }, [data]);

  const uniqueFilterValues = useMemo(() => {
    if (!filterColumn || !data?.length) return [];
    return Array.from(new Set(data.map(item => String(item[filterColumn] || ''))));
  }, [data, filterColumn]);

  const processedData = useMemo(() => {
    if (!data?.length || !selectedMetric) return [];

    let result = [...data];

    if (filterColumn && filterValue) {
      result = result.filter(item => 
        String(item[filterColumn] || '').toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (groupBy) {
      const grouped = result.reduce((acc, item) => {
        const key = String(item[groupBy] || 'Other');
        if (!acc[key]) {
          acc[key] = { 
            name: key, 
            value: 0,
            count: 0 
          };
        }
        const value = Number(item[selectedMetric]);
        if (!isNaN(value)) {
          acc[key].count += 1;
          switch (aggregationType) {
            case 'sum':
              acc[key].value += value;
              break;
            case 'average':
              acc[key].value = (acc[key].value * (acc[key].count - 1) + value) / acc[key].count;
              break;
            case 'count':
              acc[key].value = acc[key].count;
              break;
          }
        }
        return acc;
      }, {} as Record<string, { name: string; value: number; count: number }>);

      result = Object.values(grouped);
    }

    result.sort((a, b) => {
      const aValue = Number(groupBy ? a.value : a[selectedMetric]) || 0;
      const bValue = Number(groupBy ? b.value : b[selectedMetric]) || 0;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return result.slice(0, 15);
  }, [data, selectedMetric, groupBy, sortOrder, filterColumn, filterValue, aggregationType]);

  const renderChart = () => {
    if (!processedData?.length || !selectedMetric) return null;

    const dataKey = groupBy ? 'value' : selectedMetric;

    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 70 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#4f46e5" name={selectedMetric}>
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey}
              name={selectedMetric}
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={processedData}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => 
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  if (!data?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-500 mt-2">No data available for visualization</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex space-x-2">
            {[
              { type: 'bar', icon: <BarChart3 className="w-4 h-4" />, label: 'Bar' },
              { type: 'line', icon: <LineIcon className="w-4 h-4" />, label: 'Line' },
              { type: 'pie', icon: <PieIcon className="w-4 h-4" />, label: 'Pie' }
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                  chartType === type
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {icon}
                <span className="ml-1.5">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableColumns.numeric.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => {
                  setSelectedMetric(e.target.value);
                  onMetricChange?.(e.target.value);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Metric</option>
                {availableColumns.numeric.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}

          {availableColumns.categorical.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">No Grouping</option>
                {availableColumns.categorical.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}

          {groupBy && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Aggregation</label>
              <select
                value={aggregationType}
                onChange={(e) => setAggregationType(e.target.value as any)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="sum">Sum</option>
                <option value="average">Average</option>
                <option value="count">Count</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Filter Column</label>
            <select
              value={filterColumn}
              onChange={(e) => {
                setFilterColumn(e.target.value);
                setFilterValue('');
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">No Filter</option>
              {columns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {filterColumn && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Filter Value</label>
              {uniqueFilterValues.length <= 10 ? (
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {uniqueFilterValues.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Enter filter value..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-80 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}