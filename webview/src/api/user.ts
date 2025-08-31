import api from "./auth";
import type { UserSettings } from "../types";

export const userAPI = {
  getSettings: async (): Promise<UserSettings> => {
    const response = await api.get("/api/users/me/settings/");
    return response.data;
  },

  updateSettings: async (
    settings: Partial<UserSettings>
  ): Promise<UserSettings> => {
    const response = await api.put("/api/users/me/settings/", settings);
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put("/api/users/me/", profileData);
    return response.data;
  },
};
