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
            isDone: false,
            isPinned: false
        }

        tasks.push(newTask);
        saveTasks(tasks);

        const tasksLayout = document.getElementById("tasksLayoutMain");
        const taskItem = createTaskEl(newTask);

        tasksLayout.append(taskItem);

        taskName.value = "";
        hideTaskAdding();
        hasPinnedTask();
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

    hasPinnedTask();
    displayMessageIfNoTasks();
};

// get and save edited task to local storage
const saveEditedTask = (taskId) => {
    // get new task name and description 
    const editTaskName = document.getElementById("editTaskName").value;
    const editTaskDescription = document.getElementById("editTaskDescription").value;

    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (editTaskName.trim() !== "") {
        const taskElement = document.getElementById(taskId);

        // set new task name
        task.name = editTaskName; 
        taskElement.querySelector(".task__name").textContent = editTaskName;

        // set new task description
        task.description = editTaskDescription;
        const taskDescriptionEl =  taskElement.querySelector(".task__description");
        taskDescriptionEl.textContent = editTaskDescription;

        // if task description is not empty then show it, else hide it
        if(editTaskDescription.trim() !== "") {
            taskDescriptionEl.style.display = "flex";
        } else {
            taskDescriptionEl.style.display = "none";
        }

        saveTasks(tasks); // save everything to local storage
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

const pinTask = (taskId) => {
    const taskElement = document.getElementById(taskId);

    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);

    task.isPinned = !task.isPinned;

    saveTasks(tasks);

    if(task.isPinned) {
        document.getElementById("tasksLayoutPinned").appendChild(taskElement);
    } else {
        document.getElementById("tasksLayoutMain").appendChild(taskElement);
    }

    hasPinnedTask();
    displayMessageIfNoTasks();
};
