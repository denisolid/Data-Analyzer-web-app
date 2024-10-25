import React from 'react';
import { Database, RefreshCw, Trash2 } from 'lucide-react';
import { Connection } from '../types/connection';

interface ConnectionListProps {
  connections: Connection[];
  selectedId: string | undefined;
  onSelect: (connection: Connection) => void;
  onTest: (connection: Connection) => void;
  onDelete: (id: string) => void;
  testingId: string | null;
}

// Change to default export to match imports
export default function ConnectionList({
  connections,
  selectedId,
  onSelect,
  onTest,
  onDelete,
  testingId
}: ConnectionListProps) {
  // ... rest of the component code remains the same
}