import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Note {
  id: number;
  title: string;
  content: string;
  note_date: string;
  user_id: number;
}

interface CalendarProps {
  notes: Note[];
}

export default function Calendar({ notes }: CalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={notes.map(note => ({
        title: note.title,
        date: note.note_date,
      }))}
    />
  );
}
