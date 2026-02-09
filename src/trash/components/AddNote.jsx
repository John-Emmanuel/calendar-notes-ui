import api from "../api/axios";

const submit = async () => {
  await api.post("/api/notes", {
    title,
    content,
    note_date,
  });
};
