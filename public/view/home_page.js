import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import {
  onSubmitCreateForm,
  onClickExpandButton,
  onKeyDownNewItemInput,
  onMouseOverItem,
  onMouseOutItem,
  onKeyDownUpdateItem
} from "../controller/home_controller.js";
import { getTaskList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";

export async function homePageView() {
  if (!currentUser) {
    root.innerHTML = await protectedView();
    return;
  }

  const response = await fetch("/view/templates/home_page_template.html", {
    cache: "no-store",
  });
  const divWrapper = document.createElement("div");
  divWrapper.innerHTML = await response.text();
  divWrapper.classList.add("m-4", "p-4");
  const form = divWrapper.querySelector("form");
  form.onsubmit = onSubmitCreateForm;

  root.innerHTML = "";
  root.appendChild(divWrapper);

  // read all existing tasks for current user
  let taskList = [];
  try {
    taskList = await getTaskList(currentUser.uid);
  } catch (e) {
    if (DEV) console.log("failed to get task list", e);
    alert("Failed to get task list: " + JSON.stringify(e));
    return;
  }

  const container = divWrapper.querySelector("#todo-container");
  taskList.forEach((task) => {
    container.appendChild(buildCard(task));
  });

  setupSearchFeature(taskList);
}

export function buildCard(task) {
  const div = document.createElement("div");
  div.classList.add("card", "d-inline-block", "p-3", "m-2");
  div.style = "width: 25rem; border-left: 8px solid " + (task.categoryColor || "#000000");

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.id = task.docId;

  const expandButton = document.createElement("button");
  expandButton.className = "btn btn-outline-primary me-2";
  expandButton.textContent = "+";
  expandButton.onclick = onClickExpandButton;

  const title = document.createElement("span");
  title.className = "fs-3 card-title";
  title.textContent = task.taskTitle;

  const dueDate = task.dueDate?.toDate ? task.dueDate.toDate() : new Date();
  const due = document.createElement("p");
  due.className = "card-text";
  due.innerHTML = "<strong>Due:</strong> " + dueDate.toLocaleString();

  const category = document.createElement("p");
  category.className = "card-text";
  category.innerHTML = "<strong>Category:</strong> " + task.category;

  const notes = document.createElement("p");
  notes.className = "card-text";
  notes.innerHTML = "<strong>Notes:</strong> " + task.notes;

  const status = document.createElement("p");
  status.className = "card-text";
  status.innerHTML = "<strong>Status:</strong> " + (task.isCompleted ? "✅ Completed" : "❌ Incomplete");

  cardBody.append(expandButton, title, due, category, notes, status);
  div.appendChild(cardBody);
  return div;
}


function setupSearchFeature(taskList) {
  const searchBar = document.getElementById("search-bar");
  const container = document.getElementById("todo-container");

  searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTasks = taskList.filter((task) =>
      task.taskTitle.toLowerCase().includes(searchTerm)
    );
    container.innerHTML = "";
    if (filteredTasks.length === 0) {
      container.innerHTML = "<p>No matching tasks found.</p>";
    } else {
      filteredTasks.forEach((task) => {
        container.appendChild(buildCard(task));
      });
    }
  });
}
