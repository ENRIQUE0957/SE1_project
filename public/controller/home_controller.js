import { DEV } from "../model/constants.js";
import { Task } from "../model/Task.js";
import { currentUser } from "./firebase_auth.js";
import { addTask, updateTask } from "./firestore_controller.js";
import { progressMessage } from "../view/progress_message.js";
import { buildCard } from "../view/home_page.js";


// Placeholder for expand button functionality
export function onClickExpandButton(e) {
  const container = e.target.closest(".card-body");
  const notes = container.querySelector(".card-text:nth-of-type(3)");
  if (notes) {
    notes.classList.toggle("d-none");
  }
}

export function onKeyDownNewItemInput(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const form = e.target.form;
    if (form) form.dispatchEvent(new Event("submit"));
  }
}

export function onKeyDownUpdateItem(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const form = e.target.form;
    if (form) form.dispatchEvent(new Event("submit"));
  }
}

export function onMouseOutItem(e) {
  // Example: blur the input when mouse leaves the area
  if (e.target && typeof e.target.blur === 'function') {
    e.target.blur();
  }
}

export function onMouseOverItem(e) {
  if (e.target) {
    e.target.style.backgroundColor = "#f8f9fa"; // Light gray hover effect
  }
}





export async function onSubmitCreateForm(e) {
  e.preventDefault();

  const form = e.target;

  const taskTitle = form.title.value.trim();
  const category = form.category.value || 'General';
  const categoryColor = form.categoryColor.value || '#000000';
  const dueDateValue = form.dueDate.value;
  const notes = form.notes.value || '';
  const isCompleted = form.isCompleted.checked;
  const docId = form["docId"].value;

  if (!taskTitle || !dueDateValue) {
    alert("Task title and due date are required.");
    return;
  }

  const userId = currentUser.uid;
  const createdAt = new Date();
  const updatedAt = new Date();
  const dueDate = new Date(dueDateValue);

  const taskData = {
    taskTitle,
    userId,
    content: notes,
    createdAt,
    updatedAt,
    dueDate,
    category,
    categoryColor,
    isCompleted,
    notes,
  };

  const progress = progressMessage(docId ? "Updating task..." : "Creating task...");
  form.prepend(progress);

  try {
    let task;
    if (docId) {
      await updateTask(docId, taskData);
      task = new Task({ ...taskData }, docId);
    } else {
      const newDocId = await addTask(taskData);
      task = new Task({ ...taskData }, newDocId);
    }

    const container = document.getElementById("todo-container");
    container.prepend(buildCard(task));

    form.reset();
    form["docId"].value = "";
  } catch (e) {
    if (DEV) console.log("Task error:", e);
    alert("Failed to save task: " + JSON.stringify(e));
  }

  progress.remove();
}
