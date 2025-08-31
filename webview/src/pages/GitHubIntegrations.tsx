import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Github, Link, Unlink, RefreshCw } from 'lucide-react';
import { githubAPI } from '../api/github';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  private: boolean;
}

interface GitHubIntegration {
  id: number;
  repo_name: string;
  repo_url: string;
  connected_at: string;
  sync_enabled: boolean;
}

export const GitHubIntegrations: React.FC = () => {
  const { currentProject, setCurrentView } = useNavigation();
  const { accessToken } = useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [integrations, setIntegrations] = useState<GitHubIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject && accessToken) {
      fetchIntegrations();
      fetchRepos();
    }
  }, [currentProject, accessToken]);

  const fetchIntegrations = async () => {
    try {
      const data = await githubAPI.getIntegrations(currentProject.slug, accessToken!);
      setIntegrations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch integrations');
    }
  };

  const fetchRepos = async () => {
    try {
      const data = await githubAPI.getRepos(accessToken!);
      setRepos(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch repositories');
      setLoading(false);
    }
  };

  const connectRepo = async (repo: GitHubRepo) => {
    try {
      await githubAPI.connectRepo(
        currentProject.slug,
        {
          repo_name: repo.full_name,
          repo_url: repo.html_url
        },
        accessToken!
      );
      await fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect repository');
    }
  };

  const disconnectRepo = async (integrationId: number) => {
    try {
      await githubAPI.disconnectRepo(currentProject.slug, integrationId, accessToken!);
      await fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disconnect repository');
    }
  };

  const syncRepos = async () => {
    try {
      setSyncing(true);
      await githubAPI.syncRepos(currentProject.slug, accessToken!);
      await fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync repositories');
    } finally {
      setSyncing(false);
    }
  };

  const toggleSync = async (integrationId: number, currentStatus: boolean) => {
    try {
      await githubAPI.updateIntegration(
        currentProject.slug,
        integrationId,
        { sync_enabled: !currentStatus },
        accessToken!
      );
      await fetchIntegrations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update integration');
    }
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
            <Github size={32} className="mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">GitHub Integrations - {currentProject.name}</h1>
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

              {/* Connected Repositories */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Connected Repositories</h2>
                  <button
                    onClick={syncRepos}
                    disabled={syncing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
                {integrations.length === 0 ? (
                  <p className="text-gray-500">No repositories connected yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{integration.repo_name}</h3>
                          <p className="text-gray-600">{integration.repo_url}</p>
                          <p className="text-sm text-gray-500">
                            Connected: {new Date(integration.connected_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleSync(integration.id, integration.sync_enabled)}
                            className={`px-3 py-1 rounded text-sm ${
                              integration.sync_enabled
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
                          >
                            {integration.sync_enabled ? 'Enabled' : 'Disabled'}
                          </button>
                          <button
                            onClick={() => disconnectRepo(integration.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center"
                          >
                            <Unlink size={16} className="mr-1" />
                            Disconnect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Repositories */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Available Repositories</h2>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {repos.map((repo) => (
                      <div key={repo.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{repo.name}</h3>
                          <p className="text-gray-600">{repo.description || 'No description'}</p>
                          <p className="text-sm text-gray-500">{repo.private ? 'Private' : 'Public'}</p>
                        </div>
                        <button
                          onClick={() => connectRepo(repo)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center"
                        >
                          <Link size={16} className="mr-1" />
                          Connect
                        </button>
                      </div>
                    ))}
                    {repos.length === 0 && (
                      <p className="text-gray-500">No repositories found. Make sure you've granted access to your GitHub account.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};