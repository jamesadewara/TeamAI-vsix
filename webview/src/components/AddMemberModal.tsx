import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, User } from "lucide-react";
import { useProjects } from "../context/ProjectContext";
import { projectsAPI } from "../api/projects";
import type { User as UserType } from "../types";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onMemberAdded,
}) => {
  const { currentProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setSearching(true);
    try {
      const results = await projectsAPI.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to search users");
    } finally {
      setSearching(false);
    }
  };
  const handleAddMember = async () => {
    console.log("Current project:", currentProject);
    if (!selectedUser || !role || !currentProject) return;

    setLoading(true);
    setError(null);

    try {
      // Use the project ID (UUID) instead of slug for the API call
      const response = await projectsAPI.addProjectMember(
        currentProject.id || "",
        {
          user: selectedUser.id || selectedUser.username, // Using username instead of ID
          role,
          project: currentProject.id,
        }
      );

      console.log("API Response:", response);

      // Call the success callback
      onMemberAdded();

      // Reset the form
      setSelectedUser(null);
      setRole("");
      setSearchQuery("");

      // Close the modal
      onClose();
    } catch (err: any) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
    setSearchQuery(user.username);
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="user-search"
            className="block text-sm font-medium text-gray-700"
          >
            Search for User
          </label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="user-search"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full"
              placeholder="Search by username, email, or name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!!selectedUser}
            />
          </div>

          {searching && (
            <div className="mt-2 text-sm text-gray-500">Searching...</div>
          )}

          {searchResults.length > 0 && !selectedUser && (
            <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleUserSelect(user)}
                >
                  <User size={16} className="mr-2 text-gray-500" />
                  <div>
                    <div className="font-medium">{user.username}</div>
                    {user.display_name && (
                      <div className="text-sm text-gray-500">
                        {user.display_name}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="font-medium">Selected User:</div>
            <div className="flex items-center mt-1">
              <User size={16} className="mr-2 text-gray-500" />
              <div>
                <div>{selectedUser.username}</div>
                {selectedUser.display_name && (
                  <div className="text-sm text-gray-500">
                    {selectedUser.display_name}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="client">Client</option>
            <option value="pm">Project Manager</option>
            <option value="frontend_lead">Frontend Lead</option>
            <option value="backend_lead">Backend Lead</option>
            <option value="qa_lead">QA Lead</option>
            <option value="devops">DevOps</option>
            <option value="security">Security</option>
            <option value="docs">Documentation</option>
            <option value="developer_frontend">Frontend Developer</option>
            <option value="developer_backend">Backend Developer</option>
            <option value="qa">QA Engineer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            disabled={!selectedUser || !role || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            <UserPlus size={16} className="mr-2" />
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};
