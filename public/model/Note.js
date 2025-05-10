import { collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from '../firebase_core.js';
import { collectionNames, fieldNames } from './constants.js';

// Add a new note with required metadata
export async function addNote(note, userId, taskId = null) {
  const noteData = {
    ...note,
    [fieldNames.USER_ID]: userId,
    [fieldNames.CREATED_AT]: Timestamp.now(),
    [fieldNames.UPDATED_AT]: Timestamp.now(),
  };

  if (taskId) {
    noteData.taskId = taskId; // optional linking
  }

  await addDoc(collection(db, collectionNames.NOTES), noteData);
}

// Get all notes for a specific user
export async function getNotes(userId) {
  const notes = [];
  const q = query(collection(db, collectionNames.NOTES), where(fieldNames.USER_ID, '==', userId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const note = doc.data();
    note.docId = doc.id;
    notes.push(note);
  });

  return notes;
}
