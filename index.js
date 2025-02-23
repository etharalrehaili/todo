// Buttons
const submitBtn = document.getElementById("submit-btn");
const lists = document.getElementById("toDoList");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const uncompletedCount = document.getElementById("uncompleted-count");

// Initialize counters for total and completed items
let totalItems = 0;
let completedItems = 0;

// give me the items even after i refresh the page
document.addEventListener("DOMContentLoaded", InitializeTodoList);
function InitializeTodoList() {
  const todolist = JSON.parse(localStorage.getItem("todolist")) || [];
  todolist.forEach((todo) => {
    addTodoToDOM(todo.text, todo.completed);
  });
}

// Create a new todo item
function addTodoToDOM(text, isCompleted = false) {
  const todoWrapper = document.createElement("li");
  todoWrapper.classList.add("todo-item");

  // the content
  const todoItem = `
  <span class="toDoText ${isCompleted ? "completed" : ""}">${text}</span>
  <div class="button-container">
    <button class="check-btn ${isCompleted ? "unchecked" : ""}">
      ${isCompleted ? "Unchecked" : "Checked"}
    </button>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  </div>
`;

  todoWrapper.innerHTML = todoItem;
  lists.appendChild(todoWrapper);

  const toDoText = todoWrapper.querySelector(".toDoText");
  const checkBtn = todoWrapper.querySelector(".check-btn");
  const editBtn = todoWrapper.querySelector(".edit-btn");
  const deleteBtn = todoWrapper.querySelector(".delete-btn");

  // Initialize completion status
  let isCompletedState = isCompleted;
  if (isCompleted) {
    completedItems++;
  }
  totalItems++;
  updateCounts();

  // The Check button
  checkBtn.addEventListener("click", () => {
    isCompletedState = !isCompletedState;
    if (isCompletedState) {
      toDoText.classList.add("completed");
      checkBtn.textContent = "Unchecked"; // Change the button from Checked to Unchecked
      checkBtn.classList.add("unchecked");
      completedItems++;
    } else {
      toDoText.classList.remove("completed");
      checkBtn.textContent = "Checked"; // Change the button from Unchecked to Checked
      checkBtn.classList.remove("unchecked");
      completedItems--;
    }
    ReOrderTheList();
    updateCounts();
    SaveChanges();
  });

  // Edit the to-do item
  editBtn.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = toDoText.textContent;
    input.className = "edit-input";

    todoWrapper.replaceChild(input, toDoText);

    input.focus();

    input.addEventListener("blur", () => {
      saveEdit(input.value);
    });

    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        saveEdit(input.value);
      }
    });
  });

  // Function to save the edit
  function saveEdit(newTitle) {
    if (newTitle.trim() === "") {
      return;
    }

    toDoText.textContent = newTitle;
    todoWrapper.replaceChild(
      toDoText,
      todoWrapper.querySelector(".edit-input")
    );
    SaveChanges();
  }

  // The Delete button
  deleteBtn.addEventListener("click", () => {
    lists.removeChild(todoWrapper);
    totalItems--;
    if (isCompletedState) {
      completedItems--;
    }
    updateCounts();
    SaveChanges();
  });

  SaveChanges();
}

// The Submit button
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const titleInput = document.getElementById("title");

  if (titleInput.value.trim() === "") return;

  addTodoToDOM(titleInput.value);

  titleInput.value = "";
});

// Function to update counts
function updateCounts() {
  totalCount.textContent = totalItems;
  completedCount.textContent = completedItems;
  uncompletedCount.textContent = totalItems - completedItems;
}

// Function to reorder the list items, if the item is checked => goes to the bottom (last)
function ReOrderTheList() {
  const listItems = Array.from(lists.children);
  listItems.sort((a, b) => {
    const aChecked = a.querySelector(".check-btn").textContent === "Unchecked"; // Check if item is completed
    const bChecked = b.querySelector(".check-btn").textContent === "Unchecked";

    return aChecked === bChecked ? 0 : aChecked ? 1 : -1; // Move checked items to the bottom (last)
  });

  listItems.forEach((item) => lists.appendChild(item));
}

// Function to save changes
function SaveChanges() {
  const todolist = [];
  document.querySelectorAll(".todo-item").forEach((item) => {
    const text = item.querySelector(".toDoText").textContent;
    const completed = item
      .querySelector(".toDoText")
      .classList.contains("completed");
    todolist.push({ text, completed });
  });
  localStorage.setItem("todolist", JSON.stringify(todolist));
}
