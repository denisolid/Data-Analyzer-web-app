import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AnalysisResult } from '../utils/templateAnalysis';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{result.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{result.description}</p>
        
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {result.metrics.map((metric, index) => (
            <div key={index} className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">{metric.label}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {metric.value}
                {metric.change && (
                  <span className={`ml-2 text-sm font-medium ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change > 0 ? (
                      <TrendingUp className="inline h-4 w-4" />
                    ) : (
                      <TrendingDown className="inline h-4 w-4" />
                    )}
                    {Math.abs(metric.change)}%
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Key Insights</h4>
          <ul className="mt-2 space-y-2">
            {result.insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-500">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;