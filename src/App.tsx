import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import api from "./api/axios";
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
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load user on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api.get("/sanctum/csrf-cookie"); // Required for Laravel Sanctum
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
        console.log(res.data);
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
      {/* Header */}
      <header className="h-16 flex justify-between items-center px-6 bg-white dark:bg-gray-800 border-b">
        <h1 className="text-3xl font-bold">Calendar Notes App</h1>
        <div className="space-x-2">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            🌙
          </button>
          <span className="inline-block px-3 py-2 text-sm">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex flex-1 p-6 gap-6">
        {/* Left: Fully collapsible Calendar Sidebar with edge tab */}
        <aside className={`relative transition-all duration-300 ${calendarOpen ? 'w-80' : 'w-0'} flex-shrink-0`}>
          <div className={`h-full ${calendarOpen ? 'p-6' : 'p-0'} bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${calendarOpen ? 'overflow-auto' : 'overflow-hidden'}`}>
            <div className="flex items-center justify-between mb-4">
              {calendarOpen && <h2 className="text-2xl font-bold">Calendar</h2>}
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label={calendarOpen ? 'Hide calendar' : 'Show calendar'}
              >
                {calendarOpen ? '◀' : '▶'}
              </button>
            </div>

            {calendarOpen && (
              <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin]}
                initialView="timeGridDay"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridDay,timeGridWeek,dayGridMonth' }}
                // Make it feel like Google Calendar day view
                nowIndicator={true}
                allDaySlot={false}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                slotDuration="00:30:00"
                height="auto"
                events={notes.map((note) => ({ title: note.title, date: note.note_date }))}
              />
            )}
          </div>

          {/* Edge tab visible when collapsed */}
          {!calendarOpen && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <button
                onClick={() => setCalendarOpen(true)}
                className="h-12 w-8 rounded-r-md bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg"
                aria-label="Open calendar"
              >
                📅
              </button>
            </div>
          )}
        </aside>

        {/* Right: Notes (main content) */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Add Note Form */}
          <form
            onSubmit={handleAddNote}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col gap-3"
          >
            <h2 className="text-xl font-bold">Add Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white resize-none"
              rows={3}
              required
            />
            <input
              type="datetime-local"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
            <button
              type="submit"
              className="py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
            >
              Add Note
            </button>
          </form>

          {/* Notes List */}
          <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">Notes</h2>
            <div className="space-y-3">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <h3 className="font-bold text-sm">{note.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {note.content}
                  </p>
                  <small className="text-gray-600 dark:text-gray-400">
                    {note.note_date}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
