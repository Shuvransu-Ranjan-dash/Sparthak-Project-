// To-Do List Application
// This is a simple web app that allows users to add, complete, and delete tasks.
// Tasks are saved in the browser's localStorage for persistence across sessions.
// This code is structured with comments to make it easy for a new learner to understand and explain to HR.

document.addEventListener("DOMContentLoaded", () => {
  // Get references to HTML elements (assuming they exist in the HTML file)
  const taskInput = document.getElementById("taskInput"); // Input field for new tasks
  const addTaskBtn = document.getElementById("addTaskBtn"); // Button to add a task
  const taskList = document.getElementById("taskList"); // Unordered list to display tasks

  // Load tasks from localStorage when the page loads
  // If no tasks exist, start with an empty array
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks(); // Display the loaded tasks

  // Event listener for the add task button
  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim(); // Get and clean the input text
    if (taskText) {
      // Only add if there's text
      // Create a new task object with text and completion status
      tasks.push({ text: taskText, completed: false });
      taskInput.value = ""; // Clear the input field
      saveTasks(); // Save to localStorage
      renderTasks(); // Re-render the list
    }
  });

  // Function to display all tasks in the list
  function renderTasks() {
    taskList.innerHTML = ""; // Clear the current list
    tasks.forEach((task, index) => {
      // Loop through each task
      const li = document.createElement("li"); // Create a list item
      li.textContent = task.text; // Set the task text
      if (task.completed) {
        li.classList.add("completed"); // Add CSS class if completed
      }

      // Click the task to toggle completion
      li.addEventListener("click", () => {
        task.completed = !task.completed; // Flip the completed status
        saveTasks(); // Save changes
        renderTasks(); // Re-render
      });

      // Create a delete button for each task
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.marginLeft = "10px"; // Add some spacing
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the toggle click
        tasks.splice(index, 1); // Remove the task from the array
        saveTasks(); // Save changes
        renderTasks(); // Re-render
      });

      li.appendChild(deleteBtn); // Add delete button to the list item
      taskList.appendChild(li); // Add the list item to the task list
    });
  }

  // Function to save the tasks array to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
