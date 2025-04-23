import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import {
  onSubmitCreateForm,
  updateTaskInline,
  deleteTaskInline
} from "../controller/home_controller.js";
import { getTaskList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";

const categoryColors = {
  Work: "#007bff",
  Personal: "#28a745",
  School: "#ffc107",
  Other: "#6c757d"
};

let allTasks = [];

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
  const form = divWrapper.querySelector("form");
  form.onsubmit = onSubmitCreateForm;

  root.innerHTML = "";
  root.appendChild(divWrapper);

  try {
    console.log("Fetching tasks for UID:", currentUser.uid);
    allTasks = await getTaskList(currentUser.uid);
  } catch (e) {
    console.error("Failed to fetch tasks:", e.message || e);
    alert("Could not load your tasks.");
    return;
  }

  const container = divWrapper.querySelector("#todo-container");
  renderFilteredTasks("", container);
  setupSearchFeature(container);
}

function renderFilteredTasks(searchTerm, container) {
  const term = searchTerm.toLowerCase().trim();
  container.innerHTML = "";

  const filtered = allTasks.filter(task =>
    task.taskTitle.toLowerCase().includes(term) ||
    task.category.toLowerCase().includes(term)
  );

  filtered.forEach(task => {
    container.appendChild(buildCard(task));
  });
}

function setupSearchFeature(container) {
  const searchBar = document.getElementById("task-search");

  searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  searchBar.addEventListener("input", (e) => {
    renderFilteredTasks(e.target.value, container);
  });
}

function buildCard(task) {
  const div = document.createElement("div");
  div.classList.add("card", "shadow", "p-3", "border-start");
  div.style.borderLeft = `8px solid ${categoryColors[task.category] || "#000000"}`;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column gap-2";
  cardBody.id = task.docId;

  const parsedDate = task.dueDate?.toDate?.() || new Date(task.dueDate);

  // COLLAPSED INFO
  const collapsedInfo = document.createElement("div");

  collapsedInfo.innerHTML = `
    <h5 class="fw-semibold">${task.taskTitle}</h5>
    <p class="mb-1"><strong>Due:</strong> ${parsedDate.toLocaleString()}</p>
    <p class="mb-1"><strong>Category:</strong> <span class="badge text-white" style="background-color:${categoryColors[task.category] || "#6c757d"}">${task.category}</span></p>
    
  `;

  // FORM ELEMENTS (edit mode)
  const titleInput = document.createElement("input");
  titleInput.className = "form-control";
  titleInput.value = task.taskTitle;

  const dateLabel = document.createElement("label");
  dateLabel.className = "fw-semibold mt-2";
  dateLabel.textContent = "Due Date";

  const dateInput = document.createElement("input");
  dateInput.type = "datetime-local";
  dateInput.className = "form-control";
  dateInput.value = !isNaN(parsedDate) ? parsedDate.toISOString().slice(0, 16) : "";

  const categorySelect = document.createElement("select");
  categorySelect.className = "form-select";
  ["Work", "Personal", "School", "Other"].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    if (opt === task.category) option.selected = true;
    categorySelect.appendChild(option);
  });

  const notesInput = document.createElement("textarea");
  notesInput.className = "form-control";
  notesInput.rows = 3;
  notesInput.value = task.notes || "";

  const completedWrapper = document.createElement("div");
  completedWrapper.className = "form-check mt-2";
  const completedCheckbox = document.createElement("input");
  completedCheckbox.className = "form-check-input";
  completedCheckbox.type = "checkbox";
  completedCheckbox.id = `completed-${task.docId}`;
  completedCheckbox.checked = !!task.isCompleted;

  const completedLabel = document.createElement("label");
  completedLabel.className = "form-check-label";
  completedLabel.htmlFor = `completed-${task.docId}`;
  completedLabel.textContent = "Mark as Done";

  completedWrapper.appendChild(completedCheckbox);
  completedWrapper.appendChild(completedLabel);

  const status = document.createElement("div");
  status.innerHTML = `<span class="fw-semibold">Status:</span> ${task.isCompleted ? "✅ Completed" : "❌ Incomplete"}`;
  status.classList.add("mt-2");

  // BUTTONS
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "d-flex gap-2 mt-3";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-outline-primary btn-sm";
  editBtn.textContent = "Edit";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-success btn-sm";
  saveBtn.textContent = "Save";
  saveBtn.style.display = "none";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn-secondary btn-sm";
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.display = "none";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.textContent = "Delete";
  deleteBtn.style.display = "none";

  // LOGIC
  editBtn.onclick = () => {
    collapsedInfo.style.display = "none";
    titleInput.style.display = "";
    dateLabel.style.display = "";
    dateInput.style.display = "";
    categorySelect.style.display = "";
    notesInput.style.display = "";
    completedWrapper.style.display = "";
    status.style.display = "";
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    deleteBtn.style.display = "inline-block";
  };

  cancelBtn.onclick = () => {
    titleInput.value = task.taskTitle;
    const resetDate = task.dueDate?.toDate?.() || new Date(task.dueDate);
    dateInput.value = !isNaN(resetDate) ? resetDate.toISOString().slice(0, 16) : "";
    categorySelect.value = task.category;
    notesInput.value = task.notes || "";
    completedCheckbox.checked = !!task.isCompleted;
    collapsedInfo.style.display = "";
    titleInput.style.display = "none";
    dateLabel.style.display = "none";
    dateInput.style.display = "none";
    categorySelect.style.display = "none";
    notesInput.style.display = "none";
    completedWrapper.style.display = "none";
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    deleteBtn.style.display = "none";
  };

  saveBtn.onclick = async () => {
    const updatedTask = { ...task };
    updatedTask.taskTitle = titleInput.value.trim();
    updatedTask.dueDate = new Date(dateInput.value);
    updatedTask.notes = notesInput.value;
    updatedTask.category = categorySelect.value;
    updatedTask.isCompleted = completedCheckbox.checked;
    try {
      await updateTaskInline(updatedTask);
      await homePageView();
    } catch (e) {
      alert("Save failed.");
    }
  };

  deleteBtn.onclick = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTaskInline(task.docId);
      await homePageView();
    } catch (e) {
      alert("Delete failed.");
    }
  };

  // INITIAL DISPLAY SETUP
  titleInput.style.display = "none";
  dateLabel.style.display = "none";
  dateInput.style.display = "none";
  categorySelect.style.display = "none";
  notesInput.style.display = "none";
  completedWrapper.style.display = "none";

  buttonGroup.append(editBtn, saveBtn, cancelBtn, deleteBtn);

  cardBody.append(
    collapsedInfo,
    titleInput,
    dateLabel,
    dateInput,
    categorySelect,
    notesInput,
    completedWrapper,
    status,
    buttonGroup
  );

  div.appendChild(cardBody);
  return div;
}


export { buildCard };
