import { DEV } from "../model/constants.js";
import { Task } from "../model/Task.js";
import { currentUser } from "./firebase_auth.js";
import { addTask, updateTask, deleteTask } from "./firestore_controller.js";
import { progressMessage } from "../view/progress_message.js";
import { homePageView } from "../view/home_page.js";

const categoryColorMap = {
  Work: "#007bff",
  Personal: "#28a745",
  School: "#ffc107",
  Other: "#6c757d"
};

export async function onSubmitCreateForm(e) {
  e.preventDefault();
  const form = e.target;

  const taskTitle = form.title.value.trim();
  const category = form.category.value || 'Other';
  const categoryColor = categoryColorMap[category] || "#000000";
  const dueDateValue = form.dueDate.value;
  const reminderTimeValue = form.reminderTime?.value;
  const notes = form.notes.value || '';
  const isCompleted = form.isCompleted.checked;
  const docId = form["docId"].value;

  if (!taskTitle || !dueDateValue) {
    alert("Task title and due date are required.");
    return;
  }

  const taskData = {
    taskTitle,
    userId: currentUser.uid,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(dueDateValue),
    category,
    categoryColor,
    isCompleted,
    notes,
    reminderTime: reminderTimeValue ? new Date(reminderTimeValue) : null,
    reminderSent: false,
    userEmail: currentUser.email, // ✅ needed for email sending
  };

  const progress = progressMessage(docId ? "Updating..." : "Creating...");
  form.prepend(progress);

  try {
    let task;
    if (docId) {
      task = new Task({ ...taskData }, docId);
      await updateTask(task);
    } else {
      const newId = await addTask(taskData);
      task = new Task({ ...taskData }, newId);
    }

    form.reset();
    form["docId"].value = "";

    await homePageView();
  } catch (e) {
    console.error("Task error:", e);

    let message = "Unknown error.";
    if (e instanceof Error) {
      message = e.message;
    } else if (typeof e === "string") {
      message = e;
    } else if (typeof e === "object") {
      message = JSON.stringify(e, null, 2);
    }

    alert("Failed to save task:\n" + message);
  }

  progress.remove();
}


export async function updateTaskInline(task) {
  try {
    await updateTask(task);
  } catch (e) {
    alert("Update failed.");
    if (DEV) console.error("Inline update error:", e);
  }
}

export async function deleteTaskInline(docId) {
  try {
    await deleteTask(docId);
  } catch (e) {
    alert("Delete failed.");
    if (DEV) console.error("Delete error:", e);
  }
}