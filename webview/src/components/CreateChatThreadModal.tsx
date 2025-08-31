import React, { useState, useEffect } from "react";
import { X, Check, UserPlus, Users, ChevronDown } from "lucide-react";
import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import { chatAPI } from "../api/chat";

interface CreateChatThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThreadCreated: (thread: any) => void;
}

export const CreateChatThreadModal: React.FC<CreateChatThreadModalProps> = ({
  isOpen,
  onClose,
  onThreadCreated,
}) => {
  const { currentProject, members, fetchProjectMembers } = useProjects();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
   const [selectedRole, setSelectedRole] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);

  // Define available roles (match these with your backend)
  useEffect(() => {
    const availableRoles = [
      "client",
      "pm",
      "frontend_lead",
      "backend_lead",
      "qa_lead",
      "devops",
      "security",
      "docs",
      "developer_frontend",
      "developer_backend",
      "qa",
      "other"
    ];
    setRoles(availableRoles);
    setSelectedRole(availableRoles[0]); // Set default role
  }, []);


  useEffect(() => {
    if (isOpen && currentProject && user) {
      fetchProjectMembers(currentProject.id || "");

      // Convert user ID to string to ensure consistent format
      setSelectedParticipants([user.id]);
      console.log("Selected participants:", selectedParticipants);
      console.log(
        "Members:",
        members.map((m) => ({ id: m.user, username: m.user_details?.username }))
      );
    }
  }, [isOpen, currentProject]);

  // Also update the toggle function to use strings
  const handleParticipantToggle = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === members.length) {
      // Deselect all except current user
      setSelectedParticipants([user!.id]);
    } else {
      // Select all members
      setSelectedParticipants(members.map((m) => m.user || ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentProject) return;

    setLoading(true);
    setError(null);

    const participantsToSend = selectedParticipants.filter(
        (id) => id !== user!.id
    );
    console.log(participantsToSend, "yep", currentProject.id);

    try {
      const newThread = await chatAPI.createThread(currentProject.id || "", {
        project: currentProject.id || "",
        title: title.trim(),
        participants: participantsToSend,
        role: selectedRole,
      });

      onThreadCreated(newThread);
      onClose();
      setTitle("");
      setSelectedParticipants([user!.id]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create chat thread");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

 return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Create New Chat Thread</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thread Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter thread title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role *
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="appearance-none block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 pr-8 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Participants
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <UserPlus size={16} className="mr-1" />
                    {selectedParticipants.length === members.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>

                <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                  {members.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No project members found.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(
                              member.user || ""
                            )}
                            onChange={() =>
                              handleParticipantToggle(member.user || "")
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={member.user === user!.id}
                          />
                          <div className="ml-3 flex items-center">
                            {member.user_details.avatar ? (
                              <img
                                className="h-8 w-8 rounded-full mr-3"
                                src={member.user_details.avatar}
                                alt=""
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                <Users size={16} className="text-gray-600" />
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {member.user_details.display_name ||
                                  member.user_details.username}
                                {member.user === user!.id && " (You)"}
                              </span>
                              <p className="text-xs text-gray-500">
                                {member.user_details.email}
                              </p>
                            </div>
                            <span className="ml-2 text-xs text-gray-500 capitalize">
                              ({member.role})
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {selectedParticipants.length} participant(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || !title.trim() || selectedParticipants.length === 0
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      Create Thread
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
