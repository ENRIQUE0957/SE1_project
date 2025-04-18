import {
   getFirestore,
   collection,
   addDoc,
   getDocs,
   query,
   where,
   orderBy,
   updateDoc,
   deleteDoc,
   doc,
   Timestamp,
 } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
 
 import { app } from "./firebase_core.js";
 import { Task } from "../model/Task.js";
 import { db } from "../firebase/firebaseConfig.js";


 const TASKS_COLLECTION = 'tasks';

export async function getToDoTitleList(userId) {
  const titleList = [];
  const q = query(collection(db, "ToDo"), where("owner", "==", userId));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    titleList.push({
      title: data.taskTitle,
      dueDate: data.dueDate?.toDate?.() || null
    });
  });
  return titleList;
}

 
 export async function addTask(taskData) {
   taskData.createdAt = Timestamp.fromDate(new Date(taskData.createdAt));
   taskData.updatedAt = Timestamp.fromDate(new Date(taskData.updatedAt));
   taskData.dueDate = Timestamp.fromDate(new Date(taskData.dueDate));
 
   const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
   return docRef.id;
 }
 
 export async function getTaskList(userId) {
   const taskList = [];
   const q = query(
     collection(db, TASKS_COLLECTION),
     where("userId", "==", userId),
     orderBy("dueDate", "asc")
   );
 
   const snapShot = await getDocs(q);
   snapShot.forEach((docSnap) => {
     const task = new Task(docSnap.data(), docSnap.id);
     taskList.push(task);
   });
 
   return taskList;
 }
 
 export async function updateTask(docId, updateObj) {
   updateObj.updatedAt = Timestamp.now();
   const docRef = doc(db, TASKS_COLLECTION, docId);
   await updateDoc(docRef, updateObj);
 }
 
 export async function deleteTask(docId) {
   const docRef = doc(db, TASKS_COLLECTION, docId);
   await deleteDoc(docRef);
 }
 