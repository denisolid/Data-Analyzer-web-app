import React, { useState } from "react";
import { BarChart2, TrendingUp, PieChart } from "lucide-react";
import { ColumnStats } from "../utils/dataProcessor";
import { AnalysisResult } from "../utils/templateAnalysis";
import { StatisticsPanel } from "./StatisticsPanel";
import { AnalysisPanel } from "./AnalysisPanel";
import ChartDisplay from "./ChartDisplay";
import { FileUploadZone } from "./FileUploadZone";
import AnalysisTemplates from "./AnalysisTemplates";
import DataPreview from "./DataPreview";

interface DashboardProps {
  stats: ColumnStats[];
  analysis: AnalysisResult | null;
  data?: any[];
  onDataLoaded: (data: string[][], stats: any[]) => void;
}

export function Dashboard({
  stats,
  analysis,
  data = [],
  onDataLoaded,
}: DashboardProps) {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text
          .split("\n")
          .map((row) => row.split(",").map((cell) => cell.trim()));
        onDataLoaded(rows, []);
      };
      reader.readAsText(file);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setActiveTemplate(templateId);
    const metricMap: Record<string, string> = {
      "sales-analysis": "revenue",
      "traffic-analysis": "visitors",
      "product-metrics": "usage",
    };
    setSelectedMetric(metricMap[templateId] || null);
  };

  if (!stats.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to DataAnalyzer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your data or choose a template to get started
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <FileUploadZone onFileUpload={handleFileUpload} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Sample Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "sales",
                  name: "Sales Data",
                  description: "Revenue, products, dates",
                },
                {
                  id: "traffic",
                  name: "Website Traffic",
                  description: "Visitors, pages, sources",
                },
                {
                  id: "product",
                  name: "Product Metrics",
                  description: "Usage, retention, engagement",
                },
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="text-left">
                    <h5 className="text-sm font-medium text-gray-900">
                      {template.name}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8">
        {data && data.length > 0 && (
          <>
            <DataPreview
              data={data.slice(0, 6)}
              fileName={fileName}
              columnStats={stats}
            />

            <div className="bg-white rounded-lg shadow-sm">
              <ChartDisplay
                data={data}
                title="Data Visualization"
                columns={stats.map((stat) => stat.name)}
                defaultMetric={
                  selectedMetric || stats.find((s) => s.type === "number")?.name
                }
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatisticsPanel
            stats={stats}
            analysisType={activeTemplate || "general"}
          />
          {analysis && <AnalysisPanel analysis={analysis} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <BarChart2 className="h-6 w-6" />,
              title: "Export Report",
              description: "Download analysis as PDF or Excel",
            },
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Schedule Analysis",
              description: "Set up automated reports",
            },
            {
              icon: <PieChart className="h-6 w-6" />,
              title: "Share Results",
              description: "Collaborate with your team",
            },
          ].map((action, index) => (
            <button
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-lg">
                {action.icon}
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-sm font-medium text-gray-900">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
