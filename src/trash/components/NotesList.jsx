export default function NotesList({ notes }) {
  return (
    <div className="space-y-3">
      {notes.map(note => (
        <div
          key={note.id}
          className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800"
        >
          <h3 className="font-bold">{note.title}</h3>
          <p>{note.content}</p>
          <small>{note.note_date}</small>
        </div>
      ))}
    </div>
  );
}
