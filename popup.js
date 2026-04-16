let tasks = [];

function updateTime() {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
        const time = document.getElementById("timer");

        const totalSeconds = res.timer ?? 0;
        const remaining = (res.timeOption * 60) - totalSeconds;

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        time.textContent = `${formattedMinutes}:${formattedSeconds}`;
    });
}
updateTime()
setInterval(updateTime, 1000) // setInterval does not block the main thread. It schedules a callback for later.

const startTimerBtn = document.getElementById("start-timer-btn")

const emptyStatusContainer = document.getElementById("empty-status-container")


// Set initial button text based on saved isRunning state
chrome.storage.local.get(["isRunning"], (res) => {
    startTimerBtn.textContent = res.isRunning ? "Pause Timer" : "Start timer"
})

// Toggle the start timer button between start and pause
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
                isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause timer" : "Start timer"
        })
    })
})

// Add task button
const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", addTask);

// Reset timer button
const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false
    }, () => startTimerBtn.textContent = "Start timer")
})

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

function renderEmptyMessage() {
  const emptyStatusContainer = document.getElementById("empty-status-container");

  if (tasks.length === 0) {
    emptyStatusContainer.style.display = "block";

    emptyStatusContainer.textContent = "";
    const textStatus = document.createElement("p");
    textStatus.classList.add("empty-msg");
    textStatus.textContent = "No tasks yet.";

    emptyStatusContainer.appendChild(textStatus);
  } else {
    emptyStatusContainer.style.display = "none";
  }
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

  renderEmptyMessage();

  // forEach creates taskNum for us, the index. It's basically a enumerate in Python.
  // E.g. for i, task in enumerate(tasks): renderTask(i)
  tasks.forEach((taskValue, taskNum) => {
    renderTask(taskNum);
  });
}