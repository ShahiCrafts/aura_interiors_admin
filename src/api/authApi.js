import api from "./axiosInstance";

export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};