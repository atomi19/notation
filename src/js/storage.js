// get tasks from local storage
const getTasks = () => {
    const tasks = localStorage.getItem("tasks");

    if(tasks) {
        return JSON.parse(tasks);
    } else {
        return [];
    }
};

// save tasks to local storage
const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// load tasks from local storage and display them
const loadTasks = () => {
    const tasks = getTasks();

    displayMessageIfNoTasks();

    tasks.forEach(task => {
        const taskItem = createTaskEl(task);
        let whereToAppendTask;

        if(task.isPinned) {
            whereToAppendTask = document.getElementById("tasksLayoutPinned");
        } else {
            whereToAppendTask = document.getElementById("tasksLayoutMain");
        }

        whereToAppendTask.append(taskItem);

        hasPinnedTask();
    });
};
