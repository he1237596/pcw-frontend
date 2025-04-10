import axios from "axios";
// import { request } from "@/utils";
const apiClient = axios.create({
  baseURL: "http://192.168.11.146:8080/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI1ZWI4YjNhOC0wZTUwLTQ5ZjUtYmM0NC1jNzhkYjQ5Mzg5OGUiLCJpYXQiOjE3Mzk5NjI4MDYsImV4cCI6MTczOTk3MDAwNn0.eiN9Cxt7uo-RHVLC02ddypDlPn-hCRumLxu--NJkQWk"
  },
});
// 响应处理
apiClient.interceptors.response.use(function (response) {
  console.log(response,7777)
  if(response?.data?.code === 200){
    return response.data;
  } else {
    return Promise.reject(response.data.msg);
  }
});
export default apiClient;
