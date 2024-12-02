// create task element 
const createTaskEl = (task) => {
    const taskContainer = document.createElement("div");
    taskContainer.className = "task";
    taskContainer.id = task.id;

    // task container left
    const taskContainerLeft = document.createElement("div");
    taskContainerLeft.className = "task__left";

    // task container middle
    const taskContainerMiddle = document.createElement("div");
    taskContainerMiddle.className = "task__middle";

    const taskName = document.createElement("p");
    taskName.className = "task__name";
    taskName.textContent = task.name;

    const taskDescription = document.createElement("p");
    taskDescription.className = "task__description";
    taskDescription.textContent = task.description;

    // task container right
    const taskContainerRight = document.createElement("div");
    taskContainerRight.className = "task__right";

    // done button
    const doneBtn = document.createElement("button");
    doneBtn.className = "done-btn";
    doneBtn.addEventListener("click", markTaskAsDone);

    const doneIcon = document.createElement("img");
    doneIcon.className = "done-icon"
    doneIcon.src = "public/icons/done.svg";
    doneIcon.alt = "Done"

    const undoneIcon = document.createElement("img");
    undoneIcon.className = "undone-icon";
    undoneIcon.src = "public/icons/undone.svg";
    undoneIcon.alt = "Undone";

    doneBtn.append(doneIcon, undoneIcon);
    
    // more button
    const moreBtn = document.createElement("button");
    moreBtn.className = "more-btn";

    const moreIcon = document.createElement("img");
    moreIcon.className = "more-icon";
    moreIcon.src = "public/icons/more_horiz.svg";
    moreIcon.alt = "More";

    moreBtn.append(moreIcon);

    // check if task is done or not
    if(task.isDone) {
        doneIcon.style.display = "flex";
        undoneIcon.style.display = "none";
        taskContainer.classList.add("done");
    } else {
        doneIcon.style.display = "none";
        undoneIcon.style.display = "flex";
    }

    // check if task description is not empty
    if(task.description) {
        taskDescription.style.display = "flex";
    } else {
        taskDescription.style.display = "none";
    }

    // append all items
    taskContainerLeft.append(doneBtn);
    taskContainerMiddle.append(taskName, taskDescription);
    taskContainerRight.append(moreBtn);
    taskContainer.append(taskContainerLeft, taskContainerMiddle, taskContainerRight);

    return taskContainer;
};

// create context menu 
const createContextMenu = (taskId) => {
    const existingMenu = document.querySelector(".context-menu");

    if(existingMenu) {
        existingMenu.remove();
    };

    const menu = document.createElement("div");
    menu.className = "context-menu";

    // menu items
    // pin item
    const pinItem = document.createElement("div");
    pinItem.className = "context-menu__item";

    const pinIcon = document.createElement("div");
    pinIcon.className = "pin-icon";
    pinIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3c3c3c"><path d="M620-471.54 691.54-400v60H510v220l-30 30-30-30v-220H268.46v-60L340-471.54V-760h-40v-60h360v60h-40v288.46ZM354-400h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>';

    const unpinIcon = document.createElement("div");
    unpinIcon.className = "unpin-icon";
    unpinIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3c3c3c"><path d="M660-820v60h-40v307l-60-60v-247H400v87l-64.31-64.31-20.3-43H300V-820h360ZM480-90l-30-30v-220H268.46v-60L340-471.54v-62.92l-254.77-256 42.16-42.15 689.84 689.84-43.39 42.15L534.46-340H510v220l-30 30ZM354-400h121.23l-74-73.23L400-446l-46 46Zm126-193Zm-78.77 119.77Z"/></svg>'

    const currentTask = getTasks().find(t => t.id ===taskId); // get current task

    // check if selected task is pinned or not
    if(currentTask.isPinned) {
        // task is pinned, so show unpin icon
        pinItem.append(unpinIcon, document.createTextNode("Unpin Task"));
    } else {
        // task is not pinned, so show pin icon
        pinItem.append(pinIcon, document.createTextNode("Pin Task"));
    }

    // event listener for pin item
    pinItem.addEventListener("click", () => {
        pinTask(taskId);
        menu.remove();
    });

    // edit item
    const editItem = document.createElement('div');
    editItem.className = 'context-menu__item';

    const editIcon = document.createElement("div");
    editIcon.className = "edit-icon";
    editIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3c3c3c"><path d="M200-200h50.46l409.46-409.46-50.46-50.46L200-250.46V-200Zm-60 60v-135.38l527.62-527.39q9.07-8.24 20.03-12.73 10.97-4.5 23-4.5t23.3 4.27q11.28 4.27 19.97 13.58l48.85 49.46q9.31 8.69 13.27 20 3.96 11.31 3.96 22.62 0 12.07-4.12 23.03-4.12 10.97-13.11 20.04L275.38-140H140Zm620.38-570.15-50.23-50.23 50.23 50.23Zm-126.13 75.9-24.79-25.67 50.46 50.46-25.67-24.79Z"/></svg>';

    editItem.append(editIcon, document.createTextNode("Edit Task"));

    // event listener for edit item 
    editItem.addEventListener('click', () => {
        showTaskEditing(taskId);
        menu.remove(); 
    });

    // delete item
    const deleteItem = document.createElement('div');
    deleteItem.className = 'context-menu__item';

    const deleteIcon = document.createElement("div");
    deleteIcon.className = "delete-icon";
    deleteIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3c3c3c"><path d="M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-40v-60h180v-35.38h240V-780h180v60h-40v507.69Q740-182 719-161q-21 21-51.31 21H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-720ZM376.16-280h59.99v-360h-59.99v360Zm147.69 0h59.99v-360h-59.99v360ZM280-720v520-520Z"/></svg>';

    deleteItem.append(deleteIcon, document.createTextNode("Delete Task"));

    // event listener for delete item
    deleteItem.addEventListener('click', () => { 
        deleteTask(taskId);
        menu.remove(); 
    });

    // append items to the menu
    menu.append(pinItem, editItem, deleteItem);

    document.body.append(menu);

    return menu;
};

const showContextMenu = (event, taskId) => {
    const menu = createContextMenu(taskId);

    const buttonRect = event.target.getBoundingClientRect();

    // calculate position for the menu
    const mouseX = buttonRect.left - 120; 
    const mouseY = buttonRect.top; 

    // set the position of the menu
    menu.style.left = `${mouseX}px`;
    menu.style.top = `${mouseY}px`;

    menu.style.display = 'flex';

    // hide menu if click was outside
    const hideMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', hideMenu);
        }
    };
    document.addEventListener('click', hideMenu);
};

// event listener for "more" button
document.addEventListener('click', (event) => {
    const moreBtn = event.target.closest('.more-btn');
    if (moreBtn) {
        const taskItem = moreBtn.closest('.task');
        const taskId = parseInt(taskItem.id, 10); // Get the task ID
        showContextMenu(event, taskId);
    }
});

/* show task adding form*/ 
const showTaskAdding = () => {
    const addTask = document.getElementById("addTaskContainer");

    // check if form is already visible
    if(addTask.classList.contains("visible")) {
        hideTaskAdding();
    } else {
        addTask.classList.add("visible");
        addTask.style.display = "flex";
    }
};

/* hide task adding form */ 
const hideTaskAdding = () => {
    const addTask = document.getElementById("addTaskContainer");

    document.getElementById("taskName").value = ""; // clear task name input
    document.getElementById("taskDescription").value = ""; // clear task description input

    addTask.style.display = "none"; // hide task adding container
    addTask.classList.remove("visible");
};

/* show task editing form */ 
const showTaskEditing = (taskId) => {
    const editTask = document.getElementById("editTaskContainer");
    const editTaskName = document.getElementById("editTaskName");
    const editTaskDescription = document.getElementById("editTaskDescription");

    if (editTask.classList.contains("visible")) {
        hideTaskEditing();
    } else {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === taskId);

        editTask.classList.add("visible");
        editTask.style.display = "flex";

        // prefill task name and description inputs with old values
        editTaskName.value = task.name;
        editTaskDescription.value = task.description;

        const saveButton = document.getElementById("editSaveBtn");
        saveButton.onclick = () => saveEditedTask(taskId); 
    }
};

// hide task editing form 
const hideTaskEditing = () => {
    const editTask = document.getElementById("editTaskContainer");

    // clear edit form inputs
    document.getElementById("editTaskName").value = "";
    document.getElementById("editTaskDescription").value = "";

    // hide edit form
    editTask.style.display = "none";
    editTask.classList.remove("visible");
};

/* display a message that user have no tasks */ 
const displayMessageIfNoTasks = () => {
    const tasks = getTasks();

    const noTasksMessage = document.getElementById("tasksEmptyMessage");
    const tasksLayoutMain = document.getElementById("tasksLayoutMain");
    const tasksLayoutPinned = document.getElementById("tasksLayoutPinned")

    // check if user have no task
    if(tasks.length === 0) {
        noTasksMessage.style.display = "flex"; // show label that user have no tasks
        tasksLayoutMain.style.display = "none"; // hide main div 
        tasksLayoutPinned.style.display = "none";// hide pinned div
    } else {
        noTasksMessage.style.display = "none";

        // check if these at least one non pinned task
        const nonPinnedTasks = tasks.filter(t=>!t.isPinned); 

        if(nonPinnedTasks.length > 0) {
            tasksLayoutMain.style.display = "flex"; // show main div
        } else {
            tasksLayoutMain.style.display = "none"; // hide main div
        }
    }
};

const hasPinnedTask = () => {
    const tasks = getTasks();
    const tasksLayoutPinned = document.getElementById("tasksLayoutPinned");
    const isThereAnyPinnedTask = tasks.some(task => task.isPinned); 

    // check if there some pinned task
    if(isThereAnyPinnedTask) {
        tasksLayoutPinned.style.display = "flex";
    } else {
        tasksLayoutPinned.style.display = "none";
    }
}

/* function to automatically resize textarea if description is multiline */ 
const autoResizeTextarea = (event) => {
    const textarea = event.target; // get textarea element that trigerred the event

    // set height to auto
    textarea.style.height = "auto";

    // set height of textarea to match scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
}

// search for a task
const searchTask = () => {
    // get search query entered by the user
    const searchQuery = document.getElementById("searchTask").value;
    
    const pinnedTasksLabel = document.getElementById("pinnedTasksMessage");
    const allTasksLabel = document.getElementById("allTasksMessage");
    const noTasksFoundMessage = document.getElementById("noTasksFoundMessage");

    const tasks = getTasks();

    // check if search query is not empty
    if(searchQuery.trim() !== "") {
        hideAllTasks(tasks); // hide all tasks

        pinnedTasksLabel.style.display = "none"; // hide pinned tasks label
        allTasksLabel.style.display = "none"; // hide all tasks label

        // filter the tasks based on if task name or description contains search query
        const tasksQuery = filterTasks(tasks, searchQuery);

        // check if tasksQuery array is empty, so no tasks were found
        if(tasksQuery.length === 0) {
            noTasksFoundMessage.style.display = "flex";
        } else {
            noTasksFoundMessage.style.display = "none";
        }

        // get IDs of the tasks that matched search query
        const foundTasksIds = tasksQuery.map(item => item.id);

        // show all tasks that matched search query
        showTasksByIds(foundTasksIds);
    } else {
        pinnedTasksLabel.style.display = "flex"; // show pinned tasks label
        allTasksLabel.style.display = "flex"; // show all tasks label
        noTasksFoundMessage.style.display = "none"; // hide no tasks label

        // show all tasks if search query is empty
        showTasksByIds(tasks.map(task => task.id));
    }
}

// hide all tasks 
// it needs to hide all tasks and show only tasks with specific ids
const hideAllTasks = (tasks) => {
    tasks.forEach(task => {
        document.getElementById(task.id).style.display = "none";
    });
}

// filter tasks by the search query
const filterTasks = (tasks, searchQuery) => {
    return tasks.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

// show tasks with specific id
const showTasksByIds = (taskIds) => {
    taskIds.forEach(taskId => {
        document.getElementById(taskId).style.display = "flex";
    });
}