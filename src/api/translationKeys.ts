// import apiClient from "./index";
import { request as apiClient } from "@utils/index";
import { TablePaginationConfig } from 'antd';
export type PaginationProps = Pick<TablePaginationConfig, 'current' | 'pageSize'> & { search?: any }

export const getProjectKeys = async (projectId: number, {current: page, pageSize: limit, search}: PaginationProps) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/keys`, { limit, page, filter: search? JSON.stringify(search): '' });
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

export const updateTranslationKey = async (projectId: string, keyId: string, params: any) => {
  try {
    const response = await apiClient.put(`/projects/${projectId}/keys/${keyId}`, params);
    return response;
  } catch (error) {
    console.error("Error updating translation: ", error);
    throw error;
  }
};

export const updateTranslationKeyByLangId = async (langId: string, params: any) => {
  try {
    const response = await apiClient.put(`/projects/transaltions/${langId}`, params);
    return response;
  } catch (error) {
    console.error("Error updating translation: ", error);
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
