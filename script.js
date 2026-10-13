
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// Add a new task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    let title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    let task = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskInput.value = "";
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "pending") {
            return task.completed === false;
        }

        if (currentFilter === "completed") {
            return task.completed === true;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {
        let li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        let title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        let completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = task.completed
            ? "Mark Pending"
            : "Complete";

        completeBtn.addEventListener("click", function() {
            toggleTask(task.id);
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });

        li.appendChild(title);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateSummary();
}

// Mark completed or pending
function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks();
}

// Filter tasks
let filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counts
function updateSummary() {
    let completed = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    let pending = tasks.length - completed;

    document.getElementById("totalCount").textContent =
        "Total: " + tasks.length;

    document.getElementById("pendingCount").textContent =
        "Pending: " + pending;

    document.getElementById("completedCount").textContent =
        "Completed: " + completed;
}

// Show saved tasks when the page opens
displayTasks();
