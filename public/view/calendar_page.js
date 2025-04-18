import { root } from "./elements.js";
import { currentUser } from "../controller/firebase_auth.js";
import { protectedView } from "./protected_view.js";
import { getToDoTitleList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";

export async function calendarPageView() {
  if (!currentUser) {
    root.innerHTML = await protectedView();
    return;
  }

  let taskList = [];
  try {
    taskList = await getToDoTitleList(currentUser.uid);
  } catch (e) {
    if (DEV) console.log("Failed to get tasks:", e);
    alert("Could not load calendar view.");
    return;
  }

  const container = document.createElement("div");
  container.classList.add("m-4", "p-4");

  const header = document.createElement("h2");
  header.textContent = "Calendar View";
  header.classList.add("text-center", "mb-4");
  container.appendChild(header);

  const tasksByDate = {};

  taskList.forEach(task => {
    const dateStr = new Date(task.dueDate.toDate()).toDateString();
    if (!tasksByDate[dateStr]) tasksByDate[dateStr] = [];
    tasksByDate[dateStr].push(task);
  });

  Object.entries(tasksByDate).sort().forEach(([date, tasks]) => {
    const section = document.createElement("div");
    section.classList.add("mb-4");

    const dateHeading = document.createElement("h4");
    dateHeading.textContent = date;
    dateHeading.classList.add("text-primary");
    section.appendChild(dateHeading);

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.classList.add("card", "mb-2", "p-3");
      card.style.borderLeft = "8px solid " + task.categoryColor;

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = task.taskTitle;

      const notes = document.createElement("p");
      notes.classList.add("card-text");
      notes.innerHTML = "<strong>Notes:</strong> " + task.notes;

      const category = document.createElement("p");
      category.classList.add("card-text");
      category.innerHTML = "<strong>Category:</strong> " + task.category;

      const status = document.createElement("p");
      status.classList.add("card-text");
      status.innerHTML = "<strong>Status:</strong> " + (task.isCompleted ? "✅ Completed" : "❌ Incomplete");

      card.append(title, notes, category, status);
      section.appendChild(card);
    });

    container.appendChild(section);
  });

  root.innerHTML = "";
  root.appendChild(container);
}
