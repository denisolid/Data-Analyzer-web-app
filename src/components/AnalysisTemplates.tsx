import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'sales' | 'traffic' | 'metrics';
}

const templates: Template[] = [
  {
    id: 'sales-analysis',
    name: 'Sales Analysis',
    description: 'Analyze sales trends, top products, and revenue metrics',
    icon: <BarChart3 className="h-6 w-6" />,
    type: 'sales'
  },
  {
    id: 'traffic-analysis',
    name: 'Traffic Analysis',
    description: 'Analyze website traffic patterns and user behavior',
    icon: <TrendingUp className="h-6 w-6" />,
    type: 'traffic'
  },
  {
    id: 'product-metrics',
    name: 'Product Metrics',
    description: 'Track key product performance indicators',
    icon: <PieChart className="h-6 w-6" />,
    type: 'metrics'
  }
];

interface AnalysisTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

const AnalysisTemplates: React.FC<AnalysisTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              {template.icon}
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
          <p className="text-sm text-gray-500">{template.description}</p>
        </button>
      ))}
    </div>
  );
};

export default AnalysisTemplates;