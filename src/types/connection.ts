export interface Connection {
  id: string;
  name: string;
  type: 'mysql' | 'mongodb' | 'postgresql';
  host: string;
  port: string;
  database: string;
  username: string;
  password?: string;
  options?: {
    ssl?: boolean;
    [key: string]: any;
  };
}

export interface ConnectionTestResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
  isForeign: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  rowCount: number;
  size: number;
}

export interface DatabaseRelationship {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface DatabaseSchema {
  success: boolean;
  error?: string;
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
  metadata: {
    version?: string;
    encoding?: string;
    collation?: string;
    [key: string]: any;
  };
}

export interface QueryExecutionResult {
  success: boolean;
  columns?: string[];
  rows?: any[];
  error?: string;
}

export interface TableAnalysis {
  success: boolean;
  error?: string;
  analysis?: {
    columnStats: {
      [key: string]: {
        distinctValues: number;
        nullCount: number;
        avgLength?: number;
        minValue?: any;
        maxValue?: any;
      };
    };
    indexInfo: {
      name: string;
      columns: string[];
      unique: boolean;
      type: string;
    }[];
    constraints: {
      name: string;
      type: string;
      definition: string;
    }[];
  };
  recommendations?: {
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }[];
  performance?: {
    estimatedRowCount: number;
    tableSize: number;
    indexSize: number;
    scanType: string;
    cacheHitRatio?: number;
  };
}