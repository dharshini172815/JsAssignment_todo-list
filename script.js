

// showTodos();
const input = document.querySelector(".todo-input");
const categorySelect = document.querySelector(".category-select");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
const emptyImage = document.querySelector(".empty-image");

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "show-all"; // Default filter
let popupShown = false; // Track if popup has been shown

// ✅ Show Todos (Filtered)
function showTodos() {
  let filteredTodos = todosJson;

  if (filter === "completed") {
    filteredTodos = todosJson.filter(todo => todo.status === "completed");
  } else if (filter === "pending") {
    filteredTodos = todosJson.filter(todo => todo.status === "pending");
  }

  todosHtml.innerHTML = filteredTodos.length
    ? filteredTodos.map(getTodoHtml).join('')
    : `<p style="text-align:center; color: white;">No tasks found</p>`;

  emptyImage.style.display = todosJson.length === 0 ? "block" : "none";
  
  checkAllTasksCompleted();
}

// ✅ Generate Todo Item HTML
function getTodoHtml(todo, index) {
  let checked = todo.status === "completed" ? "checked" : "";
  return `
    <li class="todo" draggable="true" data-index="${index}">
      <label>
        <input type="checkbox" onclick="updateStatus(this)" id="${index}" ${checked}>
        <span class="task-name">${todo.name}</span>
        <span class="category">(${todo.category})</span>
      </label>
      <button class="edit-btn" onclick="editTask(${index})">
        <i class="fa fa-edit"></i>
      </button>
      <button class="delete-btn" onclick="removeTask(${index})">
        <i class="fa fa-times"></i>
      </button>
    </li>`;
}

function editTask(index) {
  let todo = todosJson[index]; // Get the selected task

  let newTaskName = prompt("Edit task name:", todo.name);
  
  if (newTaskName !== null) { // Check if user pressed "Cancel"
    newTaskName = newTaskName.trim();
    if (newTaskName) { // Ensure input is not empty
      todosJson[index].name = newTaskName;
      localStorage.setItem("todos", JSON.stringify(todosJson));
      showTodos(); // Refresh task list
    } else {
      alert("Task name cannot be empty.");
    }
  }
}

// ✅ Add Todo Function
function addTodo() {
  let taskName = input.value.trim();
  let category = categorySelect.value;

  if (taskName) {
    todosJson.unshift({ name: taskName, status: "pending", category });
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
    input.value = "";
    popupShown = false; // Reset popup state when adding a new task
  }
}

// ✅ Update Status
function updateStatus(checkbox) {
  todosJson[checkbox.id].status = checkbox.checked ? "completed" : "pending";
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

// ✅ Remove Todo
function removeTask(index) {
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

// ✅ Check If All Tasks Are Completed
function checkAllTasksCompleted() {
  if (todosJson.length > 0 && todosJson.every(todo => todo.status === "completed")) {
    if (!popupShown) {
      showPopup("🎉 All tasks completed successfully!");
      popupShown = true; // Prevent multiple popups
    }
  } else {
    popupShown = false; // Reset when tasks change
  }
}

// ✅ Show Popup Message
function showPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerText = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

// ✅ Delete All
deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

// ✅ Filter Todos
filters.forEach(filterBtn => {
  filterBtn.addEventListener("click", (e) => {
    filters.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    filter = e.target.dataset.filter;
    showTodos();
  });
});

// ✅ Event Listeners
addButton.addEventListener("click", addTodo);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") addTodo(); });

showTodos();
