import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
import {
  ArrowLeft,
  Save,
  Bell,
  Shield,
  User,
  Palette,
  Github,
} from "lucide-react";
import { userAPI } from "../api/user";
import type { UserSettings as UserSettingsType, PermissionMode } from "../types";

export const UserSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const { setCurrentView } = useNavigation();
  const [settings, setSettings] = useState<UserSettingsType>({
    default_permission_mode: "suggest_first",
    github_username: "",
    github_pat: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await userAPI.getSettings();
      setSettings(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch settings");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await userAPI.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof UserSettingsType, value: any) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-6">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  Settings saved successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Settings */}
                <div className="md:col-span-1">
                  <div className="flex items-center mb-4">
                    <Shield size={20} className="mr-2 text-purple-500" />
                    <h2 className="text-lg font-semibold">AI Behavior</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="default_permission_mode"
                        className="block text-sm text-gray-700 mb-2"
                      >
                        Default Permission Mode
                      </label>
                      <select
                        id="default_permission_mode"
                        value={settings.default_permission_mode}
                        onChange={(e) =>
                          handleChange(
                            "default_permission_mode",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="suggest">Suggest Before Acting</option>
                        <option value="auto">
                          Automatic (Proceed without confirmation)
                        </option>
                        <option value="manual">
                          Manual (Only when explicitly asked)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* GitHub Integration */}
                <div className="md:col-span-1">
                  <div className="flex items-center mb-4">
                    <Github size={20} className="mr-2 text-gray-800" />
                    <h2 className="text-lg font-semibold">
                      GitHub Integration
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="github_username"
                        className="block text-sm text-gray-700 mb-2"
                      >
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        id="github_username"
                        value={settings.github_username}
                        onChange={(e) =>
                          handleChange("github_username", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="github_pat"
                        className="block text-sm text-gray-700 mb-2"
                      >
                        GitHub Personal Access Token
                      </label>
                      <input
                        type="password"
                        id="github_pat"
                        value={
                          settings.github_pat === "••••••••"
                            ? ""
                            : settings.github_pat
                        }
                        onChange={(e) =>
                          handleChange("github_pat", e.target.value)
                        }
                        placeholder={
                          settings.github_pat === "••••••••"
                            ? "Already set (enter new value to change)"
                            : ""
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center disabled:opacity-50"
                >
                  <Save size={16} className="mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <User size={20} className="mr-2 text-gray-500" />
                  <h2 className="text-lg font-semibold">Account Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">
                      Username
                    </label>
                    <p className="text-sm font-medium">{user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Email</label>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Display Name
                    </label>
                    <p className="text-sm font-medium">
                      {user?.display_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Verified
                    </label>
                    <p className="text-sm font-medium">
                      {user?.is_verified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Member Since
                    </label>
                    <p className="text-sm font-medium">
                      {user?.date_joined
                        ? new Date(user.date_joined).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
