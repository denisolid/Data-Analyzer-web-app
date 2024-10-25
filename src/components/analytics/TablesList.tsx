import React, { useState } from 'react';
import { Table, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { TableMetrics } from '../../types/analytics';
import { formatBytes, formatDate } from '../../utils/formatters';

interface TablesListProps {
  tables: TableMetrics[];
}

type SortField = 'name' | 'rowCount' | 'size' | 'lastUpdate';
type SortDirection = 'asc' | 'desc';

export function TablesList({ tables }: TablesListProps) {
  const [sortField, setSortField] = useState<SortField>('size');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [search, setSearch] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTables = [...tables]
    .filter(table => 
      table.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'rowCount':
          return direction * (a.rowCount - b.rowCount);
        case 'size':
          return direction * (a.size - b.size);
        case 'lastUpdate':
          return direction * (new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime());
        default:
          return 0;
      }
    });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Database Tables</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'name', label: 'Table Name' },
                  { key: 'rowCount', label: 'Rows' },
                  { key: 'size', label: 'Size' },
                  { key: 'lastUpdate', label: 'Last Updated' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort(key as SortField)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      {sortField === key && (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTables.map((table) => (
                <tr key={table.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Table className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {table.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.rowCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatBytes(table.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(table.lastUpdate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}