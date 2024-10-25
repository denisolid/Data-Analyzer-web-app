import { Connection } from './connection';

export interface DatabaseMetrics {
  size: number;
  tables: number;
  indexes: number;
  activeConnections: number;
  queryResponseTime: number;
  uptime: number;
  version: string;
}

export interface TableMetrics {
  name: string;
  rowCount: number;
  size: number;
  avgRowLength: number;
  lastUpdate: Date;
  indexSize: number;
}

export interface QueryMetrics {
  timestamp: Date;
  query: string;
  executionTime: number;
  rowsAffected: number;
  success: boolean;
  error?: string;
}

export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  diskUsage: number;
  networkIO: {
    bytesIn: number;
    bytesOut: number;
  };
  connectionCount: number;
  timestamp: Date;
}

export interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: {
    severity: 'low' | 'medium' | 'high';
    message: string;
    recommendation: string;
  }[];
  lastCheck: Date;
}

export interface BackupStatus {
  lastBackup: Date;
  backupSize: number;
  status: 'success' | 'failed' | 'in_progress';
  location: string;
  retentionDays: number;
}

export interface MonitoringConfig {
  enabled: boolean;
  interval: number; // in seconds
  metrics: {
    performance: boolean;
    queries: boolean;
    connections: boolean;
    storage: boolean;
  };
  alerts: {
    cpu: number; // percentage threshold
    memory: number; // percentage threshold
    storage: number; // percentage threshold
    responseTime: number; // milliseconds threshold
  };
}

export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
  interval: '1m' | '5m' | '15m' | '1h' | '1d' | '1w';
}

export interface DatabaseAnalytics {
  connection: Connection;
  currentMetrics: DatabaseMetrics;
  performanceHistory: PerformanceMetrics[];
  tableMetrics: TableMetrics[];
  queryHistory: QueryMetrics[];
  health: DatabaseHealth;
  backup: BackupStatus;
  monitoring: MonitoringConfig;
}