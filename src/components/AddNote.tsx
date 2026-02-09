import api from "../api/axios";

interface AddNoteProps {
  title: string;
  content: string;
  note_date: string;
}

export const submit = async (note: AddNoteProps) => {
  await api.post("/api/notes", {
    title: note.title,
    content: note.content,
    note_date: note.note_date,
  });
};
