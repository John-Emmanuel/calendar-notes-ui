import api from "../api/axios";

await api.post("/api/login", {
  email,
  password,
});
