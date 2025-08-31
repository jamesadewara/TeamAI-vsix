import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Code, Play, Copy, Download, Sparkles } from 'lucide-react';
import { aiAPI } from '../api/ai';
import { useProjects } from '../context/ProjectContext';

export const AdvancedAI: React.FC = () => {
  const { setCurrentView } = useNavigation();
  const { currentProject } = useProjects();
  const { accessToken } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.generateCode(currentProject?.id||"", prompt, accessToken!);
      setGeneratedCode(response.code);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applySuggestion = async () => {
    // This would integrate with VS Code API to apply the code
    // For now, we'll just show a message
    alert('This would apply the code to your current file in VS Code');
  };

  if (!currentProject) {
    setCurrentView('dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-6">
          <button 
            onClick={() => setCurrentView('project')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center">
            <Sparkles size={32} className="mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Advanced AI - {currentProject.name}</h1>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Describe what you want to build</h2>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the functionality you want to create, e.g., 'Create a React component that displays a list of users with search functionality'"
                    className="w-full h-48 border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={generateCode}
                    disabled={loading || !prompt.trim()}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Code size={16} className="mr-2" />
                        Generate Code
                      </>
                    )}
                  </button>
                </div>

                {/* Output Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Generated Code</h2>
                  {generatedCode ? (
                    <div className="border border-gray-300 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center bg-gray-200 px-3 py-2 rounded-t-md">
                        <span className="text-sm font-medium">generated-code.js</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={copyToClipboard}
                            className="text-gray-600 hover:text-gray-800"
                            title="Copy to clipboard"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={downloadCode}
                            className="text-gray-600 hover:text-gray-800"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={applySuggestion}
                            className="text-gray-600 hover:text-gray-800"
                            title="Apply to current file"
                          >
                            <Play size={16} />
                          </button>
                        </div>
                      </div>
                      <pre className="p-3 overflow-auto max-h-64 text-sm">
                        {generatedCode}
                      </pre>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-md bg-gray-50 h-48 flex items-center justify-center">
                      <p className="text-gray-500">Your generated code will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Examples Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Example Prompts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setPrompt('Create a React hook for managing form state with validation')}
                  >
                    <h3 className="font-semibold mb-2">Form Management Hook</h3>
                    <p className="text-sm text-gray-600">Generate a custom React hook for form state management</p>
                  </div>
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setPrompt('Create an Express.js middleware for authentication using JWT')}
                  >
                    <h3 className="font-semibold mb-2">Authentication Middleware</h3>
                    <p className="text-sm text-gray-600">Generate Express middleware for JWT authentication</p>
                  </div>
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setPrompt('Create a utility function to debounce API calls in JavaScript')}
                  >
                    <h3 className="font-semibold mb-2">Debounce Utility</h3>
                    <p className="text-sm text-gray-600">Generate a debounce function for API calls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};