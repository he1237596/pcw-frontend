// import apiClient from "./index";
import { request as apiClient } from "@/utils";
// import Tips, { message } from '@/components/Tips'
interface UserInfo {
  username: string;
  email: string;
  [key: string]: any;
}
export const getUserInfo = async () => {
  try {
    const response = await apiClient.get(`/user/current`);
    console.log(response, 9999)
    return response;
  } catch (error) {
    console.error("Error fetching getUserInfo: ", error);
    throw error;
  }
};


export const updateUserInfo = async (userInfo: UserInfo) => {
  try {
    const response = await apiClient.put(`/user`, userInfo);
    return response;
  } catch (error) {
    console.error("Error creating project: ", error);
    throw error;
  }
};

export const updatePassword = async (params: { oldPassword: string; password: string; }) => {
  try {
    const response = await apiClient.put(`/user/updatePassword`, params);
    return response;
  } catch (error) {
    console.error("Error creating updatePassword: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post(`/user/logout`);
    return response;
  } catch (error) {
    console.error("Error logout: ", error);
    // throw error;
  }
};

export const login = async (params: { username: string; password: string; }) => {
  try {
    const response = await apiClient.post<{ token: string }>(`/user/login`, params);
    // console.log(response.code, 9999)
    // const { code } = response;
    // console.log(code)
    return response;
  } catch (error) {
    console.error("Error login: ", error);
    throw error;
  }
};
export const register = async (params: { username: string; password: string; }) => {
  try {
    const response = await apiClient.post(`/user/register`, params);
    // console.log(response.code, 9999)
    // const { code } = response;
    // console.log(code)
    return response;
  } catch (error) {
    console.error("Error login: ", error);
    throw error;
  }
};
