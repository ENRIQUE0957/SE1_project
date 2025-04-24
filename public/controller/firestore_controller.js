import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { db } from "../firebase/firebaseConfig.js";

export async function getTaskList(userId) {
  const tasks = [];
  const q = query(collection(db, "ToDo"), where("userId", "==", userId), orderBy("dueDate", "asc"));
  const snapshot = await getDocs(q);
  snapshot.forEach((docSnap) => {
    const task = docSnap.data();
    task.docId = docSnap.id;
    tasks.push(task);
  });
  return tasks;
}

export async function addTask(taskData) {
  taskData.taskTitle = taskData.taskTitle?.trim() || "Untitled";

  // 💡 Only convert if valid Date
  if (taskData.createdAt instanceof Date && !isNaN(taskData.createdAt)) {
    taskData.createdAt = Timestamp.fromDate(taskData.createdAt);
  } else {
    taskData.createdAt = Timestamp.now();
  }

  if (taskData.updatedAt instanceof Date && !isNaN(taskData.updatedAt)) {
    taskData.updatedAt = Timestamp.fromDate(taskData.updatedAt);
  } else {
    taskData.updatedAt = Timestamp.now();
  }

  if (taskData.dueDate instanceof Date && !isNaN(taskData.dueDate)) {
    taskData.dueDate = Timestamp.fromDate(taskData.dueDate);
  } else {
    throw new Error("Invalid due date");
  }

  if (taskData.reminderTime instanceof Date && !isNaN(taskData.reminderTime)) {
    taskData.reminderTime = Timestamp.fromDate(taskData.reminderTime);
  } else {
    taskData.reminderTime = null;
  }
  taskData.reminderSent = false;

  const docRef = await addDoc(collection(db, "ToDo"), taskData);
  return docRef.id;
}

export async function updateTask(task) {
  const docRef = doc(db, "ToDo", task.docId);

  const data = {
    taskTitle: task.taskTitle.trim(),
    updatedAt: Timestamp.fromDate(new Date()),
    dueDate: Timestamp.fromDate(new Date(task.dueDate)),
    notes: task.notes || "",
    isCompleted: task.isCompleted || false,
    category: task.category,
    categoryColor: task.categoryColor || "#000000",
    reminderTime: task.reminderTime instanceof Date && !isNaN(task.reminderTime)
      ? Timestamp.fromDate(task.reminderTime)
      : null,
    reminderSent: false,
  };

  await updateDoc(docRef, data);
}


export async function deleteTask(docId) {
  const ref = doc(db, "ToDo", docId);
  await deleteDoc(ref);
}