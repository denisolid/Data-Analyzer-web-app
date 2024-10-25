import { ColumnStats, calculateCorrelation } from './dataProcessor';

export interface AnalysisResult {
  title: string;
  description: string;
  metrics: {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    benchmark?: number;
  }[];
  insights: string[];
  correlations?: {
    col1: string;
    col2: string;
    correlation: number;
  }[];
}

const calculateTrend = (values: number[]): number => {
  const n = values.length;
  if (n < 2) return 0;
  
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, curr, i) => acc + curr * values[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);

  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
};

const findCorrelations = (data: string[][], stats: ColumnStats[]) => {
  const numericColumns = stats.filter(s => s.type === 'number');
  const correlations: { col1: string; col2: string; correlation: number; }[] = [];

  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i];
      const col2 = numericColumns[j];
      const col1Index = stats.indexOf(col1);
      const col2Index = stats.indexOf(col2);

      const values1 = data.slice(1).map(row => Number(row[col1Index])).filter(v => !isNaN(v));
      const values2 = data.slice(1).map(row => Number(row[col2Index])).filter(v => !isNaN(v));

      if (values1.length === values2.length && values1.length > 0) {
        const correlation = calculateCorrelation(values1, values2);
        if (!isNaN(correlation) && Math.abs(correlation) > 0.5) {
          correlations.push({
            col1: col1.name,
            col2: col2.name,
            correlation: Number(correlation.toFixed(2))
          });
        }
      }
    }
  }

  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
};

export const analyzeSalesData = (data: string[][], stats: ColumnStats[]): AnalysisResult => {
  const revenueCol = stats.find(col => 
    col.type === 'number' && 
    col.name.toLowerCase().includes('revenue')
  );
  const quantityCol = stats.find(col => 
    col.type === 'number' && 
    col.name.toLowerCase().includes('quantity')
  );
  const dateCol = stats.find(col => col.type === 'date');

  const metrics = [];
  const insights = [];

  if (revenueCol) {
    const revenueIndex = stats.indexOf(revenueCol);
    const values = data.slice(1).map(row => Number(row[revenueIndex])).filter(v => !isNaN(v));
    const total = values.reduce((a, b) => a + b, 0);
    const trend = calculateTrend(values);
    const yoyGrowth = dateCol ? calculateYoYGrowth(data, revenueIndex, stats.indexOf(dateCol)) : null;

    metrics.push({
      label: 'Total Revenue',
      value: total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      trend: trend > 0.05 ? 'up' : trend < -0.05 ? 'down' : 'stable',
      change: yoyGrowth
    });

    if (quantityCol) {
      const avgOrderValue = total / values.length;
      metrics.push({
        label: 'Average Order Value',
        value: avgOrderValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        benchmark: revenueCol.median
      });
    }
  }

  if (quantityCol) {
    const quantityIndex = stats.indexOf(quantityCol);
    const values = data.slice(1).map(row => Number(row[quantityIndex])).filter(v => !isNaN(v));
    const totalUnits = values.reduce((a, b) => a + b, 0);
    const trend = calculateTrend(values);

    metrics.push({
      label: 'Total Units Sold',
      value: totalUnits.toLocaleString(),
      trend: trend > 0.05 ? 'up' : trend < -0.05 ? 'down' : 'stable'
    });
  }

  // Find correlations between metrics
  const correlations = findCorrelations(data, stats);
  correlations.forEach(({ col1, col2, correlation }) => {
    insights.push(
      `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation (${correlation}) between ${col1} and ${col2}`
    );
  });

  // Add seasonal patterns if date column exists
  if (dateCol) {
    const seasonalPatterns = detectSeasonalPatterns(data, stats);
    if (seasonalPatterns.length > 0) {
      insights.push(...seasonalPatterns);
    }
  }

  return {
    title: 'Sales Performance Analysis',
    description: 'Comprehensive analysis of sales metrics and trends',
    metrics,
    insights,
    correlations
  };
};

const calculateYoYGrowth = (data: string[][], valueIndex: number, dateIndex: number): number | null => {
  // Implementation of year-over-year growth calculation
  try {
    const sortedData = data.slice(1)
      .map(row => ({
        date: new Date(row[dateIndex]),
        value: Number(row[valueIndex])
      }))
      .filter(item => !isNaN(item.value) && !isNaN(item.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (sortedData.length < 2) return null;

    const currentValue = sortedData[sortedData.length - 1].value;
    const previousValue = sortedData[0].value;
    
    return ((currentValue - previousValue) / previousValue) * 100;
  } catch {
    return null;
  }
};

const detectSeasonalPatterns = (data: string[][], stats: ColumnStats[]): string[] => {
  const patterns: string[] = [];
  const dateCol = stats.find(col => col.type === 'date');
  const valueCol = stats.find(col => col.type === 'number');

  if (!dateCol || !valueCol) return patterns;

  try {
    const dateIndex = stats.indexOf(dateCol);
    const valueIndex = stats.indexOf(valueCol);

    const monthlyAverages = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);

    data.slice(1).forEach(row => {
      const date = new Date(row[dateIndex]);
      const value = Number(row[valueIndex]);

      if (!isNaN(date.getTime()) && !isNaN(value)) {
        const month = date.getMonth();
        monthlyAverages[month] += value;
        monthlyCounts[month]++;
      }
    });

    const averages = monthlyAverages.map((sum, i) => 
      monthlyCounts[i] > 0 ? sum / monthlyCounts[i] : 0
    );

    const maxMonth = averages.indexOf(Math.max(...averages));
    const minMonth = averages.indexOf(Math.min(...averages));

    if (maxMonth !== minMonth) {
      patterns.push(
        `Peak performance typically occurs in ${new Date(2000, maxMonth).toLocaleString('default', { month: 'long' })}`,
        `Lowest performance typically in ${new Date(2000, minMonth).toLocaleString('default', { month: 'long' })}`
      );
    }
  } catch {
    // Ignore errors in seasonal pattern detection
  }

  return patterns;
};

export const analyzeProductMetrics = (data: string[][], stats: ColumnStats[]): AnalysisResult => {
  // Similar implementation for product metrics...
  // This would include product-specific KPIs and insights
  return {
    title: 'Product Performance Analysis',
    description: 'Analysis of product metrics and performance indicators',
    metrics: [],
    insights: []
  };
};