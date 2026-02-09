import api from "../api/axios";

interface LoginProps {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginProps) => {
  return await api.post("/api/login", {
    email,
    password,
  });
};
