// import apiClient from "./index";
import { request as apiClient } from "@/utils";

export const getProjects = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get(`/projects`, { page, limit });
    console.log(response.data, 9999)
    return response.data;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

export const exportProjects = (id: string|number, filename?: string ) => {
  return apiClient.downloadFile(`/projects/${id}/export`, { filename: `${filename}.xlsx` });
};

export const createProject = async (project: { name: string; description: string; }) => {
  try {
    const response = await apiClient.post(`/projects`, project);
    console.log(response.data, 9999)
    return response.data;
  } catch (error) {
    console.error("Error creating project: ", error);
    throw error;
  }
};

export const updateProject = async (id: string, project: { name: string; description: string; }) => {
  try {
    const response = await apiClient.put(`/projects/${id}`, project);
    return response.data;
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

export const deleteProject = async (id: string | number) => {
  try {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};
