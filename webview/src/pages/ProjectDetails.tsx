import React, { useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProjects } from '../context/ProjectContext';
import { ArrowLeft, Github, Calendar, Settings, User, Sparkles, Users, GitBranch, Shield } from 'lucide-react';

export const ProjectDetails: React.FC = () => {
  const { currentProject, setCurrentView } = useNavigation();
  const { fetchProjectMembers, fetchProjectRepositories, members, repositories } = useProjects();

  useEffect(() => {
    if (currentProject) {
      fetchProjectMembers(currentProject.id);
      fetchProjectRepositories(currentProject.id);
    }
  }, [currentProject]);

  if (!currentProject) {
    setCurrentView('dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-6">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
            <p className="text-gray-600">{currentProject.description}</p>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <Users size={24} className="text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold">Members</h3>
                  </div>
                  <p className="text-2xl font-bold">{currentProject.member_count}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <GitBranch size={24} className="text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold">Repositories</h3>
                  </div>
                  <p className="text-2xl font-bold">{repositories.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <Shield size={24} className="text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold">Your Role</h3>
                  </div>
                  <p className="text-2xl font-bold capitalize">{currentProject.user_role}</p>
                </div>
              </div>

              {/* Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setCurrentView('ai-sessions')}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded text-center flex flex-col items-center"
                >
                  <Sparkles size={24} className="mb-2" />
                  <span>AI Sessions</span>
                </button>
                <button 
                  onClick={() => setCurrentView('chat')}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-4 rounded text-center flex flex-col items-center"
                >
                  <User size={24} className="mb-2" />
                  <span>Chat</span>
                </button>
                <button 
                  onClick={() => setCurrentView('github')}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded text-center flex flex-col items-center"
                >
                  <Github size={24} className="mb-2" />
                  <span>GitHub</span>
                </button>
                <button 
                  onClick={() => setCurrentView('audit')}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-4 px-4 rounded text-center flex flex-col items-center"
                >
                  <Calendar size={24} className="mb-2" />
                  <span>Audit Logs</span>
                </button>
                <button 
                  onClick={() => setCurrentView('advanced-ai')}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded text-center flex flex-col items-center"
                >
                  <Sparkles size={24} className="mb-2" />
                  <span>Advanced AI</span>
                </button>
                <button 
                  onClick={() => setCurrentView('user-settings')}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded text-center flex flex-col items-center"
                >
                  <Settings size={24} className="mb-2" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Members List */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Project Members</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {member.user_details.avatar ? (
                                  <img className="h-10 w-10 rounded-full" src={member.user_details.avatar} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <User size={20} className="text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {member.user_details.display_name || member.user_details.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {member.user_details.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.created_at??"").toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};