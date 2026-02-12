import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Note {
  title: string;
  note_date: string;
}

interface LeftNavProps {
  user: User;
  notes: Note[];
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}

export default function LeftNav({ user, notes, calendarOpen, setCalendarOpen }: LeftNavProps) {

    return(<>
    <div className={`min-h-screen relative transition-all duration-100 ${!calendarOpen ? 'w-0' : 'w-1/2'}`}>
          <button
          type="button"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className={`sticky rounded-full bg-blue-500 z-10 items-center p-2 transition-all duration-10 ${calendarOpen ? 'top-9 left-1/2' : 'top-9 left -1'}`}
            ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path></svg>
            </button>

            <div className="flex flex-col grow border-r border-gray-200">
              
                      {(calendarOpen &&<FullCalendar
                        plugins={[timeGridPlugin, dayGridPlugin]}
                        initialView="timeGridDay"
                        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridDay,timeGridWeek,dayGridMonth' }}
                        nowIndicator={true}
                        allDaySlot={false}
                        slotMinTime="01:00:00"
                        slotMaxTime="24:00:00"
                        slotDuration="00:30:00"
                        height="auto"
                        events={notes.map((note) => ({ title: note.title, date: new Date(note.note_date.slice(0, -1)) }))}
                      />)}  
            </div> 
        </div>
    
    </>)


}