// add task into local storage
const addTask = () => {
    const taskName = document.getElementById("taskName");
    const taskDescription = document.getElementById("taskDescription");

    // check if task name input is not empty
    if(taskName.value.trim() !== "") {
        const tasks = getTasks();

        const newTask = {
            id: Date.now(),
            name: taskName.value,
            description: taskDescription.value,
            isDone: false
        }

        tasks.push(newTask);
        saveTasks(tasks);

        const tasksLayout = document.getElementById("tasksLayout");
        const taskItem = createTaskEl(newTask);

        tasksLayout.append(taskItem);

        taskName.value = "";
        hideTaskAdding();
        displayMessageIfNoTasks();
    } else {
        console.error("Task name cannot be empty");
    }
};

const deleteTask = (taskId) => {
    const tasks = getTasks();
    // create new array that includes all tasks except that one with matching taskId
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    saveTasks(updatedTasks); // save new array

    // remove task element from the DOM
    const taskElement = document.getElementById(taskId);
    if(taskElement) {
        taskElement.remove();  
    } 

    displayMessageIfNoTasks();
};

// get and save edited task to local storage
const saveEditedTask = (taskId) => {
    const editTaskName = document.getElementById("editTaskName").value;
    const editTaskDescription = document.getElementById("editTaskDescription").value;

    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        // get old name and description from local storage
        task.name = editTaskName;
        task.description = editTaskDescription;

        saveTasks(tasks); 

        // update task in the DOM
        const taskElement = document.getElementById(taskId);

        taskElement.querySelector(".task__name").textContent = editTaskName;
        taskElement.querySelector(".task__description").textContent = editTaskDescription;

        hideTaskEditing(); // hide edit form
    }
};

// mark task as done and save it to local storage
const markTaskAsDone = (event) => {
    const taskItem = event.target.closest(".task");
    const taskId = parseInt(taskItem.id, 10);
    
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);

    task.isDone = !task.isDone;

    saveTasks(tasks);

    // if task is done then show done icon 
    taskItem.querySelector(".done-icon").style.display = task.isDone ? "flex" : "none"; 
    // if task is not done show undone icon
    taskItem.querySelector(".undone-icon").style.display = task.isDone ? "none" : "flex";

    if(task.isDone) {
        taskItem.classList.add("done")
    } else {
        taskItem.classList.remove("done");
    }
};
