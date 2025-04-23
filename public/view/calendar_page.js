import { root } from "./elements.js";
import { currentUser } from "../controller/firebase_auth.js";
import { protectedView } from "./protected_view.js";
import { getTaskList } from "../controller/firestore_controller.js";


export async function calendarPageView() {
  if (!currentUser) {
    root.innerHTML = await protectedView();
    return;
  }

  let taskList = [];
  try {
    taskList = await getToDoTitleList(currentUser.uid);
  } catch (e) {
    alert("Could not load calendar view.");
    return;
  }

  const container = document.createElement("div");
  container.classList.add("m-4", "p-4");

  const header = document.createElement("h2");
  header.textContent = "Calendar View";
  header.classList.add("text-center", "mb-4");
  container.appendChild(header);

  const toggleGroup = document.createElement("div");
  toggleGroup.classList.add("flex", "gap-4", "justify-center", "mb-4");

  const zoomLevels = ["Day", "Week", "Month", "Year"];
  const currentZoom = { value: "Month" };

  zoomLevels.forEach(level => {
    const btn = document.createElement("button");
    btn.textContent = level;
    btn.classList.add("border", "px-4", "py-1", "rounded");
    if (level === currentZoom.value) btn.classList.add("bg-gray-300");
    btn.onclick = () => {
      currentZoom.value = level;
      renderTasks(taskList, currentZoom.value);
    };
    toggleGroup.appendChild(btn);
  });

  const viewToggleBtn = document.createElement("button");
  viewToggleBtn.textContent = "List View";
  viewToggleBtn.classList.add("ml-4", "underline");
  viewToggleBtn.onclick = () => {
    renderTasks(taskList, currentZoom.value, true);
  };

  toggleGroup.appendChild(viewToggleBtn);
  container.appendChild(toggleGroup);

  const output = document.createElement("div");
  container.appendChild(output);

  function renderTasks(tasks, zoom, listMode = false) {
    output.innerHTML = "";
    const grouped = {};

    tasks.forEach(task => {
      const date = new Date(task.dueDate);
      let key;
      if (zoom === "Day") key = date.toDateString();
      else if (zoom === "Week") {
        const firstDay = new Date(date);
        firstDay.setDate(date.getDate() - date.getDay());
        key = firstDay.toDateString();
      } else if (zoom === "Month") key = date.toLocaleString("default", { month: "long", year: "numeric" });
      else if (zoom === "Year") key = date.getFullYear().toString();

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(task);
    });

    Object.entries(grouped).forEach(([group, tasks]) => {
      const section = document.createElement("div");
      section.classList.add("mb-4");

      const label = document.createElement("h3");
      label.textContent = group;
      label.classList.add("font-bold", "text-lg", "mb-2");
      section.appendChild(label);

      const ul = document.createElement("ul");
      tasks.forEach(t => {
        const li = document.createElement("li");
        li.textContent = `${t.taskTitle} (${new Date(t.dueDate).toLocaleString()})`;
        ul.appendChild(li);
      });

      section.appendChild(ul);
      output.appendChild(section);
    });
  }

  renderTasks(taskList, currentZoom.value);
  root.innerHTML = "";
  root.appendChild(container);
}
