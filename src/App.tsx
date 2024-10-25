import React, { useState, useEffect } from 'react';
import { BarChart2, Upload, Database, Settings, LogOut } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { GreetingPage } from './components/GreetingPage';
import ConnectionManager from './components/ConnectionManager';
import { getAuthToken, getCurrentUser, logout } from './api/auth';
import { analyzeData, ColumnStats } from './utils/dataProcessor';
import { analyzeSalesData, analyzeProductMetrics, AnalysisResult } from './utils/templateAnalysis';
import { Toast } from './components/Toast';

type ActiveView = 'dashboard' | 'connections' | 'settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<ColumnStats[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    const user = getCurrentUser();
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const handleDataLoaded = (rawData: string[][], initialStats: ColumnStats[]) => {
    const headers = rawData[0];
    const rows = rawData.slice(1).map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        const value = row[index];
        obj[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return obj;
    });

    setData(rows);
    
    const columnStats = analyzeData(rawData);
    setStats(columnStats);
    
    if (columnStats.some(col => col.name.toLowerCase().includes('revenue'))) {
      setAnalysis(analyzeSalesData(rawData, columnStats));
      showToast('Sales data analysis completed', 'success');
    } else if (columnStats.some(col => col.name.toLowerCase().includes('quantity'))) {
      setAnalysis(analyzeProductMetrics(rawData, columnStats));
      showToast('Product metrics analysis completed', 'success');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  if (!isLoggedIn) {
    return <GreetingPage onAuthSuccess={handleAuthSuccess} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'connections', label: 'Connections', icon: <Database className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'connections':
        return <ConnectionManager />;
      case 'settings':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive alerts and reports via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Data Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Auto-save Analysis</p>
                      <p className="text-sm text-gray-500">Automatically save analysis results</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard stats={stats} analysis={analysis} data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <BarChart2 className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">DataAnalyzer</span>
            </a>
            <div className="flex items-center space-x-4">
              <FileUpload onDataLoaded={handleDataLoaded} />
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`w-64 bg-white border-r border-gray-200 min-h-screen ${
          isSidebarOpen ? '' : 'hidden'
        }`}>
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`${
                    activeView === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;