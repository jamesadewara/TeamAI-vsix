import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useNavigation } from '../context/NavigationContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { Plus, Users, Eye, EyeOff } from 'lucide-react';
import type { Project } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { projects, loading, error, fetchProjects } = useProjects();
  const { setCurrentProject } = useProjects();
  const { setCurrentView } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);


   useEffect(() => {
    fetchProjects();
  },  []);

  

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentView('project');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.display_name || user?.username}!</span>
            <button
              onClick={logout}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  New Project
                </button>
              </div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {projects.length === 0 ? (
                <p>No projects found. Create your first project!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.visibility === 'private' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {project.visibility === 'private' ? <EyeOff size={12} className="mr-1" /> : <Eye size={12} className="mr-1" />}
                          {project.visibility}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={16} className="mr-1" />
                          {project.member_count} members
                        </div>
                        <div className="text-sm text-gray-500">
                          Role: <span className="font-medium capitalize">{project.user_role}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleOpenProject(project)}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Open Project
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};