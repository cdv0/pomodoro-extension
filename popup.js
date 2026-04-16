let tasks = [];

const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", addTask);

// Populates tasks array from data in the chrome storage
chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

// Updates array in chrome storage
function saveTasks() {
  chrome.storage.sync.set({
    tasks: tasks,
  });
}

// Adds a new empty input/button UI
function addTask() {
  tasks.push(""); // Adds an empty string because a new task starts as blank text
  saveTasks();
  renderTasks();
}

// Redraws the UI. Creates one row of the input/button task UI
function renderTask(taskNum) {
  const taskRow = document.createElement("div");
  taskRow.classList.add("task-row");

  const text = document.createElement("input");
  text.classList.add("input");
  text.type = "text";
  text.placeholder = "Enter a task";
  text.value = tasks[taskNum];

  text.addEventListener("change", (event) => {
    tasks[taskNum] = event.target.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.classList.add("btn");
  deleteBtn.type = "button";
  deleteBtn.value = "Done";

  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1); // Splicing updates array length/indeces
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";

  // forEach creates taskNum for us, the index. It's basically a enumerate in Python.
  // E.g. for i, task in enumerate(tasks): renderTask(i)
  tasks.forEach((taskValue, taskNum) => {
    renderTask(taskNum);
  });
}