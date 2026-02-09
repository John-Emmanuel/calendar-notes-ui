import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import api from "./api/axios";
import Auth from "./pages/Auth.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load user on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
       
        const res = await api.get("/api/user");
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
        const res = await api.get("/api/notes");
        console.log(res.data);
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [user]);

  // Add note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/notes", {
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
      {/* Header */}
      <header className="h-16 flex justify-between items-center px-6 bg-white dark:bg-gray-800 border-b">
        <h1 className="text-3xl font-bold">Calendar Notes App</h1>
        <div className="space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={toggleTheme}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 p-4 overflow-auto">
        {/* Calendar */}
        <div className="mb-6 h-[500px] md:h-[600px] lg:h-[700px]">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={notes.map((note) => ({
              title: note.title,
              date: new Date(note.note_date.slice(0, -1)),
            }))}
            height="100%"
          />
        </div>

        {/* Add Note Form */}
        <form
          onSubmit={handleAddNote}
          className="mb-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-xl space-y-2"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          />
          <input
            type="datetime-local"
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Note
          </button>
        </form>

        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-200 dark:bg-gray-800 rounded-xl"
            >
              <h3 className="font-bold">{note.title}</h3>
              <p>{note.content}</p>
              <small>{new Date(note.note_date.slice(0, -1)).toLocaleString("en-US", { dateStyle:'long', timeStyle:'short' })}</small>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
