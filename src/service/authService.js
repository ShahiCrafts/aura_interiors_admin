import * as authApi from "../api/authApi";

export const login = async (credentials) => {
  const res = await authApi.login(credentials);
  return res.data;
};
