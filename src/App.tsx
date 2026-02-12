import { useState, useEffect } from "react";

import TopNav from './components/navigation/TopNav';
import LeftNav from './components/navigation/LeftNav';
import Notes from './components/content/Notes';
import api from "./api/axios.ts";
import Auth from "./pages/Auth";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  note_date: string;
  user_id: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load user on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // await api.get("/sanctum/csrf-cookie"); // Required for Laravel Sanctum
        const res = await api.get<User>("/api/user");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Load notes when user exists
  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      try {
        const res = await api.get<Note[]>("/api/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [user]);

  // Add note
  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post<Note>("/api/notes", {
        title,
        content,
        note_date: noteDate,
      });
      setNotes([...notes, res.data]);
      setTitle("");
      setContent("");
      setNoteDate("");
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      setUser(null);
      setNotes([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
      </div>
    );
  }

  // Show Auth if not logged in
  if (!user) return <Auth onLogin={setUser} />;

  // Main app UI
  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <TopNav user={user} toggleTheme={toggleTheme} handleLogout={handleLogout} />
      <div className="flex flex-1 p-6 gap-6">
    
        <LeftNav user={user} notes={notes} calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />

        {/* Right: Notes (main content) */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Notes List */}
          <Notes user={user} notes={notes} setNotes={setNotes} />
        </div>
      </div>
    </div>
  );
}

export default App;
