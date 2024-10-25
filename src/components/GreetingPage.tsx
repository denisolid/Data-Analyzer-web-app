import React, { useState } from 'react';
import { BarChart2, ArrowRight } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { login, signup } from '../api/auth';

interface GreetingPageProps {
  onAuthSuccess: () => void;
}

export function GreetingPage({ onAuthSuccess }: GreetingPageProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setError(null);
      await login(credentials);
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const handleSignup = async (credentials: { username: string; email: string; password: string }) => {
    try {
      setError(null);
      await signup(credentials);
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <a href="/" className="inline-block">
            <div className="flex justify-center items-center mb-4">
              <BarChart2 className="h-16 w-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              DataAnalyzer
            </h1>
          </a>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Transform your data into actionable insights with our powerful analytics platform
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
          {/* Features */}
          <div className="md:w-1/2 max-w-lg">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Enterprise Analytics Suite
              </h2>
              <ul className="space-y-4">
                {[
                  'Advanced data visualization',
                  'Real-time business analytics',
                  'Custom enterprise metrics & KPIs',
                  'Secure database integration',
                  'Interactive dashboards',
                  'Enterprise-grade security'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <ArrowRight className="h-5 w-5 text-indigo-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="md:w-1/2 max-w-md">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex">
                <button
                  className={`flex-1 py-3 text-sm font-medium ${
                    showLogin
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-medium ${
                    !showLogin
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowLogin(false)}
                >
                  Sign Up
                </button>
              </div>
              <div className="p-6">
                {showLogin ? (
                  <LoginForm onLogin={handleLogin} error={error} />
                ) : (
                  <SignupForm onSignup={handleSignup} error={error} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}