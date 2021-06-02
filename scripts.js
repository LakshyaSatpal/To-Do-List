const newTaskForm = document.querySelector(".add-task-form");
const taskSearchForm = document.querySelector(".task-search-form");
const listContainer = document.querySelector(".list-container");
const cardsContainer = document.querySelector(".cards-container");
const deleteBtn = document.querySelectorAll(".delete-card");
const done = document.querySelector(".done");
const doneBtn = done.querySelector(".check-all");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let modal;
let backdrop;
function addTask(e) {
  e.preventDefault();
  const newTaskName = this.querySelector('input[name="task"]').value;
  if (newTaskName.trim().length === 0) {
    this.querySelector('input[name="task"]').blur();
    showErrorHandler(
      "Invalid Input",
      "Please enter a valid input (non-empty value)"
    );
    return;
  }
  const task = {
    name: newTaskName,
    isDone: false,
  };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showList(tasks);
  this.reset();
}

function showList(array) {
  if (array.length === 0) {
    cardsContainer.innerHTML = `<p class="no-tasks">No tasks found.</p>`;
    done.style.display = "none";
    return;
  } else {
    done.style.display = "block";
    cardsContainer.innerHTML = array
      .map((task, i) => {
        return `<div id='item${i}' class="task-card ${
          task.isDone ? "complete" : "incomplete"
        }">
              <div class="checkbox-container">
              <input type="checkbox" id="check${i}" class="check" ${
          task.isDone ? "checked" : ""
        }/>
              <label for="check${i}" data-labelindex='${i}' class="checkmark"></label>
              </div>
              <p class="task-name">${task.name}</p>
              <p class="task-status">${
                task.isDone
                  ? "Completed <i class='fas fa-check-circle i-completed'></i>"
                  : "Incomplete <i class='fas fa-times-circle i-incomplete'></i>"
              }</p> 
              <button data-btnindex='${i}' class="btn delete-card">Delete</button></div>`;
      })
      .join("");
  }
}

function toggleDone(e) {
  if (!e.target.matches("label")) return;
  const el = e.target;
  const index = el.dataset.labelindex;
  tasks[index].isDone = !tasks[index].isDone;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showList(tasks);
}

function showErrorHandler(head, msg) {
  modal = document.createElement("div");
  backdrop = document.createElement("div");

  backdrop.className = "backdrop";
  modal.className = "modal";

  const modalHeading = document.createElement("h2");
  modalHeading.textContent = `${head}`;
  modalHeading.className = "modal-heading";

  const modalMsg = document.createElement("p");
  modalMsg.className = "modal-msg";
  modalMsg.textContent = `${msg}`;

  const modalBtn = document.createElement("button");
  modalBtn.textContent = "Okay";
  modalBtn.className = "btn modal-btn";

  document.body.append(backdrop);
  document.body.append(modal);
  setTimeout((showModal) => {
    modal.classList.add("show-modal");
  }, 10);
  modal.append(modalHeading);
  modal.append(modalMsg);
  modal.append(modalBtn);

  modalBtn.addEventListener("click", closeErrorHandler);
  backdrop.addEventListener("click", closeErrorHandler);
}

function closeErrorHandler() {
  modal.remove();
  backdrop.remove();
}

function deleteCardHandler(e) {
  if (!e.target.matches(".delete-card")) return;
  const index = e.target.dataset.btnindex;
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showList(tasks);
}

function taskSearchHandler() {
  const enteredText = this.querySelector("input[name='search']").value;
  console.log(enteredText);
  const enteredRegex = new RegExp(enteredText, "gi");
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card, i) => {
    cardName = card.querySelector(".task-name").innerText;
    console.log(cardName);
    if (cardName.match(enteredRegex)) {
      card.style.display = "block";
    } else card.style.display = "none";
  });
}

function doneAllHandler() {
  tasks.forEach((task) => {
    task.isDone = true;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showList(tasks);
  showErrorHandler(
    "Congratulations!",
    "Congrats, you have completed all your tasks"
  );
}

showList(tasks);
cardsContainer.addEventListener("click", deleteCardHandler);
newTaskForm.addEventListener("submit", addTask);
cardsContainer.addEventListener("click", toggleDone);
taskSearchForm.addEventListener("input", taskSearchHandler);
doneBtn.addEventListener("click", doneAllHandler);
