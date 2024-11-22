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
    }

    const menu = document.createElement("div");
    menu.className = "context-menu";

    // menu items
    // edit item
    const editItem = document.createElement('div');
    editItem.className = 'context-menu__item';

    const editIcon = document.createElement("img");
    editIcon.className = "edit-icon";
    editIcon.src = "public/icons/edit.svg";
    editIcon.alt = "Edit";
    editItem.append(editIcon, document.createTextNode("Edit Task"));

    // event listener for edit item 
    editItem.addEventListener('click', () => {
        showTaskEditing(taskId);
        menu.remove(); 
    });


    // delete item
    const deleteItem = document.createElement('div');
    deleteItem.className = 'context-menu__item';

    const deleteIcon = document.createElement("img");
    deleteIcon.className = "delete-icon";
    deleteIcon.src = "public/icons/delete.svg";
    deleteIcon.alt = "Delete";
    deleteItem.append(deleteIcon, document.createTextNode("Delete Task"));

    // event listener for delete item
    deleteItem.addEventListener('click', () => { 
        deleteTask(taskId);
        menu.remove(); 
    });

    // append items to the menu
    menu.append(editItem, deleteItem);

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

    // check if user have no task
    if(tasks.length === 0) {
        noTasksMessage.style.display = "flex";
    } else {
        noTasksMessage.style.display = "none";
    }
};