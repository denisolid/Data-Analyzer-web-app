import React, { useState, useEffect } from 'react';
import { Plus, X, Database } from 'lucide-react';
import { Connection } from '../types/connection';
import { getDatabaseSchema } from '../utils/connectionTester';

// Add proper export
export interface QueryBuilderProps {
  connection: Connection;
  onQueryChange: (query: string) => void;
}

export function QueryBuilder({ connection, onQueryChange }: QueryBuilderProps) {
  // ... rest of the component code remains the same
}