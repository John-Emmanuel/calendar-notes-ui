import { useState, useEffect, useRef } from "react";

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

    const titleTimers = useRef<Map<number, number>>(new Map());
    const contentTimers = useRef<Map<number, number>>(new Map());


    const updateTitle = async (noteId:number,newTitle:string) => {
        console.log(noteId, newTitle)
    }

    const handletitileChange= async (noteId:number,newTitle:string) => {

        // Clear the timer for THIS specific note
        const existingTimer = titleTimers.current.get(noteId);
        if(existingTimer !== undefined) {
            clearTimeout(existingTimer);
        }

        // Set a new timer for THIS specific note
        const timer = window.setTimeout(async() => {
            await updateTitle(noteId, newTitle);
            titleTimers.current.delete(noteId);
        }, 5000);

        titleTimers.current.set(noteId, timer);
    }
    

    const updateContent = async (noteId:number,newContent:string) => {
        console.log(noteId, newContent)
    }

    const  handleContentChange= async (noteId:number,newContent:string) => {

        // Clear the timer for THIS specific note
        const existingTimer = contentTimers.current.get(noteId);
        if(existingTimer !== undefined) {
            clearTimeout(existingTimer);
        }

        // Set a new timer for THIS specific note
        const timer = window.setTimeout(async() => {
            await updateContent(noteId, newContent);
            contentTimers.current.delete(noteId);
        }, 5000);

        contentTimers.current.set(noteId, timer);
    }
        



    return(<>
    <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">Notes</h2>
            <div className="space-y-3">
              {notes.map(note => (
                <div className="shadow-lg rounded" key={note.id}>
                    <div className="header bg-yellow-600 p-2 rounded-t">
                        <input type="text" className="outline-none focus:outline-none"  defaultValue={note.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handletitileChange(Number(note.id), e.currentTarget.value)}}/>
                    </div>
                    <textarea rows={4} className="p-4 outline-none resize-none" placeholder="Enter something here..." defaultValue={note.content} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {handleContentChange(Number(note.id), e.currentTarget.value)}}>
                    </textarea>
                    <div className="footer bg-yellow-600 p-2 rounded-b">{new Date(note.note_date.slice(0, -1)).toLocaleString("en-US", { dateStyle:'long', timeStyle:'short' })}</div>
                </div>
                
              ))}
            </div>
          </div>
    
    </>)
}

