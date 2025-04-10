// import apiClient from "./index";
import { request as apiClient } from "@/utils";

export const getProjectKeys = async (projectId: number, page: number, limit: number) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/keys`, { page, limit });
    return response;
  } catch (error) {
    console.error("Error fetching project keys: ", error);
    throw error;
  }
};

export const createTranslationKey = async (projectId: string, key: any) => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/keys`, key);
    return response;
  } catch (error) {
    console.error("Error creating translation key: ", error);
    throw error;
  }
};

export const updateTranslationKey = async (projectId: string, keyId: string, key: any) => {
  try {
    const response = await apiClient.put(`/projects/${projectId}/keys/${keyId}`, key);
    return response;
  } catch (error) {
    console.error("Error updating translation key: ", error);
    throw error;
  }
};

export const deleteTranslationKey = async (projectId: string | number, keyId: string | number) => {
  try {
    const response = await apiClient.delete(`/projects/${projectId}/keys/${keyId}`);
    return response;
  } catch (error) {
    console.error("Error deleting translation key: ", error);
    throw error;
  }
};
