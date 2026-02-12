import { useState, useEffect } from "react";

import api from "../../api/axios";


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

interface NotesProps {
    user: User;
    notes: Note[];
    setNotes: (notes: Note[]) => void;
}


export default function Notes({user, notes, setNotes}: NotesProps){

    return(<>
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
                    {new Date(note.note_date.slice(0, -1)).toLocaleString("en-US", { dateStyle:'long', timeStyle:'short' })}
                  </small>
                </div>
              ))}
            </div>
          </div>
    
    </>)
}

