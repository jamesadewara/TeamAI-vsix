import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { aiSessionsAPI } from '../api/aiSessions';
import { useProjects } from '../context/ProjectContext';

interface AISession {
  id: number;
  name: string;
  status: 'running' | 'paused' | 'stopped';
  created_at: string;
}

export const AISessions: React.FC = () => {
  const {  setCurrentView } = useNavigation();
  const { currentProject } = useProjects();
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject && accessToken) {
      fetchSessions();
    }
  }, [currentProject, accessToken]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await aiSessionsAPI.getSessions(currentProject?.id||"", accessToken!);
      setSessions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch AI sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    try {
      const newSession = await aiSessionsAPI.createSession(
        currentProject?.id||"", 
        { name: `New Session ${sessions.length + 1}` },
        accessToken!
      );
      setSessions([...sessions, newSession]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create AI session');
    }
  };

  const toggleSessionStatus = async (sessionId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'running' ? 'paused' : 'running';
      await aiSessionsAPI.updateSessionStatus(
        currentProject?.id||"",
        sessionId,
        { status: newStatus },
        accessToken!
      );
      setSessions(sessions.map(session => 
        session.id === sessionId ? { ...session, status: newStatus } : session
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update session');
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      await aiSessionsAPI.deleteSession(currentProject?.id||"", sessionId, accessToken!);
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete session');
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
          <h1 className="text-3xl font-bold text-gray-900">AI Sessions - {currentProject.name}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">AI Sessions</h2>
                <button 
                  onClick={createSession}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  New Session
                </button>
              </div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{session.name}</h3>
                        <p className="text-gray-600">Status: {session.status}</p>
                        <p className="text-gray-500 text-sm">
                          Created: {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleSessionStatus(session.id, session.status)}
                          className={`p-2 rounded ${
                            session.status === 'running' 
                              ? 'bg-yellow-500 hover:bg-yellow-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                        >
                          {session.status === 'running' ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No AI sessions found. Create your first session!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};