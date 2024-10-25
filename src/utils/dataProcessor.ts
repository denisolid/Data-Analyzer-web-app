export interface ColumnStats {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  unique: number;
  missing: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  standardDeviation?: number;
}

export const analyzeData = (data: string[][]): ColumnStats[] => {
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);
  
  return headers.map((header, colIndex) => {
    const values = rows.map(row => row[colIndex]).filter(val => val !== '');
    const type = inferColumnType(values);
    const stats: ColumnStats = {
      name: header,
      type,
      unique: new Set(values).size,
      missing: rows.length - values.length,
    };

    if (type === 'number') {
      const numbers = values.map(Number).filter(n => !isNaN(n));
      stats.min = Math.min(...numbers);
      stats.max = Math.max(...numbers);
      stats.mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      
      // Calculate median
      const sorted = [...numbers].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      stats.median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];

      // Calculate standard deviation
      const mean = stats.mean;
      const squareDiffs = numbers.map(value => Math.pow(value - mean, 2));
      stats.standardDeviation = Math.sqrt(
        squareDiffs.reduce((a, b) => a + b, 0) / numbers.length
      );
    }

    return stats;
  });
};

const inferColumnType = (values: string[]): ColumnStats['type'] => {
  const sample = values.find(v => v !== '');
  if (!sample) return 'string';

  if (!isNaN(Number(sample))) return 'number';
  if (!isNaN(Date.parse(sample))) return 'date';
  if (['true', 'false'].includes(sample.toLowerCase())) return 'boolean';
  return 'string';
};

export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = Math.min(x.length, y.length);
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  
  const numerator = x.reduce((sum, xi, i) => 
    sum + (xi - xMean) * (y[i] - yMean), 0
  );
  
  const xStdDev = Math.sqrt(x.reduce((sum, xi) => 
    sum + Math.pow(xi - xMean, 2), 0
  ) / n);
  
  const yStdDev = Math.sqrt(y.reduce((sum, yi) => 
    sum + Math.pow(yi - yMean, 2), 0
  ) / n);
  
  return numerator / (n * xStdDev * yStdDev);
};