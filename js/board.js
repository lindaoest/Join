/*** Asynchronously renders the board by loading tasks and contacts, updating the HTML, and setting the active page to 3.*/
async function renderBoard() {
    await loadTasks();
    await loadContacts();
    updateHTML();
    setActivePage3();
}
document.querySelector('.input-board-top').addEventListener('input', function () {
    searchTasks(this.value);
});

/* Searches for tasks based on the given query and updates the HTML with the filtered tasks.* @param {string} query - The search query to filter the tasks. */
function searchTasks(query) {
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase()));
    updateHTML(filteredTasks);
}

/* Updates the HTML based on the filtered tasks or all tasks if no filter is specified.
* @param {Array} filteredTasks - An array of tasks to be displayed, defaults to all tasks if not specified.*/
function updateHTML(filteredTasks = tasks) {
    const taskStatusMap = {
        'to-do': 'to-do', 'in-progress': 'in-progress','await-feedback': 'await-feedback', 'done-tasks': 'done-tasks',
    };
    for (const status in taskStatusMap) {
        const filteredStatusTasks = filteredTasks.filter(t => t['status'] == taskStatusMap[status]);
        const columnElement = document.getElementById(status);
        let message = 'No tasks To do';
        if (filteredStatusTasks.length > 0) {
            filteredStatusTasksFunction(columnElement, filteredStatusTasks);
        } else {
            columnElement.innerHTML = `<div class="no-tasks">${message}</div>`;
        }}
    }

/** Function to update the column element with filtered status tasks* @param {Element} columnElement - The HTML element to be updated
 * @param {Array} filteredStatusTasks - The array of tasks to be filtered and displayed*/
function filteredStatusTasksFunction(columnElement, filteredStatusTasks) {
    columnElement.innerHTML = '';
    for (let index = 0; index < filteredStatusTasks.length; index++) {
        const element = filteredStatusTasks[index];
        columnElement.innerHTML += generateTodoHTML(element, index);
    }
}
let currentDraggedElement;

/* * Generates HTML for a todo element.* @param {Object} element - the todo element* @param {number} index - the index of the element* @return {string} the HTML for the todo element*/
function generateTodoHTML(element, index) {
    let fullNames = element['assign-to'];
    let subtasks = element['subtasks'];
    let finishedSubtasks = element['finishedSubtasks'];
    let contactsArray = loadedContacts;
    let progress = 0;
    if (finishedSubtasks && finishedSubtasks.length > 0) {
        progress = (finishedSubtasks.length / subtasks.length) * 100;}
    let initials = '';
    for (let f = 0; f < Math.min(3, fullNames.length); f++) {
        let fullName = fullNames[f]['name'];
        let nameInitials = getInitials(fullName);
        let contactIndex = contactsArray.findIndex(contact => contact.name === fullName);
        let matchingColor;
        if (contactIndex == -1) {
            matchingColor = 'black';
            initials += `<p id="initials-circle-${f}" class="initials-circle" style='background-color : ${matchingColor}'>${nameInitials}</p>`;
        } else {
            matchingColor = contactsArray[contactIndex].color;
            initials += `<p id="initials-circle-${f}" class="initials-circle" style='background-color : ${matchingColor}'>${nameInitials}</p>`;
        }}
    return generateTaskCard(element, index, progress, finishedSubtasks, initials, fullNames);
}

/** Generates a task card HTML with the provided element, index, progress, finishedSubtasks, initials, and fullNames.* @param {any} element - the element to be included in the task card
 * @param {number} index - the index of the task card* @param {number} progress - the progress of the task
 * @param {number} finishedSubtasks - the number of finished subtasks* @param {string} initials - the initials of the task owner
 * @param {string} fullNames - the full names of the task owner* @return {string} the HTML template for the task card*/
function generateTaskCard(element, index, progress, finishedSubtasks, initials, fullNames) {
    let plusContacts = Math.max(0, fullNames.length - 3);
    let additionalContacts = '';
    if (plusContacts > 0) {
        additionalContacts = `<p>+${plusContacts}</p>`;
    }
    return taskCardHtmlTemplate(element, index, progress, finishedSubtasks, initials, additionalContacts);
}

/* A function to start dragging an element.* @param {type} id - the id of the element being dragged* @return {type} */
function startDragging(id) { //die Id markiert das Element das gerade verschoben wird
    currentDraggedElement = id;
}

/* Prevents the default behavior of the given event.* @param {Event} ev - the event object */
function allowDrop(ev) {
    ev.preventDefault();
}

/* Moves the current dragged element to the specified status.* @param {string} status - the status to move the current dragged element  */
function moveTo(status) {
    let currentTaskIndex = tasks.findIndex(task => task.id === currentDraggedElement);
    tasks[currentTaskIndex]['status'] = status;
    setItem('tasks', JSON.stringify(tasks));   //saves status of our board
    updateHTML();
    removeHighlight(status);
}

/* Function to highlight the specified element by adding a CSS class.* @param {string} id - The ID of the element to be highlighted*/
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}
/* Removes the 'drag-area-highlight' class from the element with the specified id.*/
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/* Opens the move task menu and toggles its active state.* @param {event} event - the event triggering the function */
function openMoveTaskMenu(event) {
    event.stopPropagation();
    let openMoveTask = document.getElementById('open-move-task');
    openMoveTask.classList.toggle('active');
}

/*** Closes the move task.*/
function closeMoveTaskTo() {
    let openMoveTask = document.getElementById('open-move-task');
    openMoveTask.classList.remove('active');
}

/*** Updates the status of a task on mobile.* @param {string} currentId - The ID of the current task* @param {string} status - The new status of the task */
function moveTaskMobile(currentId, status) {
    let currentTaskIndex = tasks.findIndex(task => task.id === currentId);
    let newStatus = status;
    tasks[currentTaskIndex]['status'] = newStatus;
    setItem('tasks', JSON.stringify(tasks));   //saves status of our board
    updateHTML();
    closeTaskOverview()
}

/*** Opens an 'add task' popup and populates it with a task based on the given status.* @param {type} status - the status of the task* @return {type} undefined*/
function openAddTaskPopup(status) {
    let popup = document.getElementById('add-task-popup');
    popup.innerHTML = returnTask(status);
    popup.style.display = 'block';
    getCategories();
    getContacts();
    checkRequired();
}

/*** Function to check required fields and enable the add task button accordingly.*/
function checkRequired() {
    let title = document.getElementById('title');
    let dateDue = document.getElementById('due-date');
    if (title) {
        checkTitle(title);
    }
    if (dateDue) {
        checkDate(dateDue);
}}

/* Listens for input on the title element and enables the add task button if title, date, and category are not locked.* @param {type} title - the title element to listen to for inpu*/
function checkTitle(title) {
    title.addEventListener('input', function () {
        if (this.value !== '') {
            titleLock = false;}
        if (!titleLock && !dateLock && !categoryLock) {
            enableAddTaskButton();}
    })}

/**
 * Function to check the date input and enable the add task button based on certain conditions.
 * @param {type} dateDue - the date input element to be checked
 **/
function checkDate(dateDue) {
    dateDue.addEventListener('input', function () {
        if (this.value !== '') {
            dateLock = false;}
        if (!titleLock && !dateLock && !categoryLock) {
            enableAddTaskButton();}
    })}

/* Closes the add task popup.*/
function closeAddTaskPopup() {
    let popup = document.getElementById('add-task-popup');
    popup.style.display = 'none';
}

/*** Opens the task overview by displaying the overview container and related elements, and creates the overview for the given id.* @param {type} id - The id of the task*/
function openTaskOverview(id) {
    let overviewEdit = document.getElementById('task-big-view-edit-card');
    let overview = document.getElementById('overview-container');
    let overviewCard = document.getElementById('task-big-view-card');
    overviewEdit.style.display = 'none';
    overview.style.display = 'flex';
    overviewCard.style.display = 'flex';
    overviewCard.style.flexDirection = 'column';
    createOverview(id);
}

/* Closes the task overview by hiding the overview container.*/
function closeTaskOverview() {
    let overview = document.getElementById('overview-container');
    overview.style.display = 'none';
}

/* Edit the task overview based on the provided ID.* @param {number} id - The ID of the task to be edited* @return {void} */
function editTaskOverview(id) {
    let task = tasks.find(task => task.id === id);
    let overviewCard = document.getElementById('task-big-view-card');
    let overviewEdit = document.getElementById('task-big-view-edit-card');
    overviewCard.style.display = 'none';
    overviewEdit.style.display = 'block';
    if (task) {
    generateEditCard(task);}
}

/** Closes the edit card by hiding the overview container and updating the HTML.*/
function closeEditCard() {
    let overview = document.getElementById('overview-container');
    overview.style.display = 'none';
    updateHTML();
}

/** Retrieves the initials from the given name.* @param {string} name - The full name from which to extract the initials* @return {string} The initials extracted from the name */
function getInitials(name) {
    if (name) {
        let names = name.split(' ');
        if (names.length > 1) {
            return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
        } else if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
    }return '';
}

/** Asynchronously clears the tasks by setting an empty array in the 'tasks' item, then updates the HTML.* @return {Promise<void>} */
async function clearTasks() {
    let tasks = [];
    await setItem('tasks', JSON.stringify(tasks));
    updateHTML();
}

/*** Create an overview for a task with the given ID.* @param {string} id - The ID of the task*/
function createOverview(id) {
    let task = tasks.find(task => task.id === id);
    let title = task['title'];
    let date = task['date'];
    let category = task['category'];
    let description = task['description'];
    let priority = task['priority'].toLowerCase();
    let overviewCard = document.getElementById('task-big-view-card');
    generateAssignTo(task.id);
    overviewCard.innerHTML = createOverviewHTMLTemplate(category, title, description, date, priority, task)
}
/*** Generates HTML for the assigned tasks based on the provided task ID.* @param {number} id - The ID of the task to generate HTML for
 * @return {string} The HTML generated for the assigned tasks*/
function generateAssignTo(id) {
    let task = tasks.find(task => task.id === id);
    let fullNames = task['assign-to'];
    let generateHtml = '';
    let initials;
    let contactsArray = loadedContacts;
    for (let j = 0; j < fullNames.length; j++) {
        let fullName = fullNames[j]['name'];
        let contactIndex = contactsArray.findIndex(contact => contact.name === fullName);
        initials = fullName.split(" ");
        if (contactIndex !== -1) {
            let matchingColor = contactsArray[contactIndex].color;
            generateHtml += overViewContact(matchingColor, fullName, initials);
        } else {
            let matchingColor = 'black';
            generateHtml += overViewContact(matchingColor, fullName, initials);
        }
    }return generateHtml;
}

/** Generates an overview contact element* @param {string} matchingColor - the matching color for the contact* @param {string} fullName - the full name of the contact
 * @param {string} initials - the initials of the contact* @return {string} the overview contact element*/
function overViewContact(matchingColor, fullName, initials) {
    return OverviewHTML( matchingColor, fullName, initials);
}

/*** Generates HTML for the subtasks of a given task based on the task ID.* @param {number} id - The ID of the task to generate subtasks for* @return {string} The generated HTML for the subtasks*/
function generateSubtasks(id) {
    let task = tasks.find(task => task.id === id);
    let subArray = task['subtasks'];
    let finishedSubtasksArray = task['finishedSubtasks'];
    let generateHtml = '';
    for (let j = 0; j < subArray.length; j++) {
        let subtask = subArray[j];
        generateHtml += `
        <div class="subtask">
            <input id="subtask-checkbox-${j}" type="checkbox" ${finishedSubtasksArray.includes(subtask) ? `checked` : ''} onclick="finishedSubtask(${task.id}, ${j})">
            <p id="subtask-text">${subtask}</p></div>`;
    }return generateHtml;
}

/*** Asynchronously handles the finishing of a subtask within a task. * @param {type} id - description of parameter* @param {type} j - description of parameter* @return {type} description of return value*/
async function finishedSubtask(id, j) {
    let task = tasks.find(task => task.id === id);
    let subArray = task['subtasks'];
    let subtask = subArray[j];
    let finishedSubtasksArray = task['finishedSubtasks'];
    let checkbox = document.getElementById(`subtask-checkbox-${j}`)
    if (checkbox.checked) {
        finishedSubtasksArray.push(subtask)
    } else if (!checkbox.checked) {
        let index = finishedSubtasksArray.indexOf(subtask);
        if (index !== -1) {
            finishedSubtasksArray.splice(index, 1);
        }}
    await setItem('tasks', JSON.stringify(tasks));
    updateHTML();
}
/* Deletes a task from the tasks array by its id, updates the storage, and refreshes the HTML.* @param {number} id - The id of the task to be deleted*/
async function deleteTask(id) {
    let taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        // Die Aufgabe wurde gefunden, jetzt kannst du sie löschen
        tasks.splice(taskIndex, 1);
    }
    await setItem('tasks', JSON.stringify(tasks));
    closeTaskOverview();
    updateHTML();
}

/* Generates an edit card for the given task, populating it with the task details and setting up event listeners for editing.
/* @param {object} task - The task object containing title, date, description, and priority*/
function generateEditCard(task) {
    let title = task['title'];
    let date = task['date'];
    let description = task['description'];
    let priority = task['priority'].toLowerCase();
    let editCard = document.getElementById('task-big-view-edit-card');
    editCard.innerHTML = generateEditTaskHTMLTemplate(task);
    let titleInput = document.getElementById('overview-edit-title-input');
    let descriptionArea = document.getElementById('description-overview-edit');
    let dueDateInput = document.getElementById('due-date-edit');
    let priorityButton = document.getElementById(`priority-${priority}`);
    titleInput.value = title;
    descriptionArea.value = description;
    dueDateInput.value = date;
    removePriority();
    priorityButton.classList.add(`${priority}`);
    addSubtasks(task);
    getContacts();
    addContacts(task);
}

/*** Adds subtasks to the task and updates the subtask list in the HTML.* @param {object} task - The task object containing subtasks*/
function addSubtasks(task) {
    let subtasks = task['subtasks'];
    let subtaskList = document.getElementById('list-item-subtasks');
    for (let j = 0; j < subtasks.length; j++) {
        const subtask = subtasks[j];
        subtaskList.innerHTML += addSubtaskHtmlTemplate(subtask, j);
        subtasksArray.push(subtask);
    }
}

/** Adds contacts to the task.* @param {Object} task - The task to which contacts are added*/
function addContacts(task) {
    let assignToArray = task['assign-to'];
    let addedContacts = document.getElementById('added-contacts');
    for (let j = 0; j < assignToArray.length; j++) {
        let assignTo = assignToArray[j]['name'];
        let assignToColor = assignToArray[j]['color'];
        let splittedLetters = assignTo.split(" ");
        addedContacts.innerHTML += `
            <div class="circle" style="background-color:${assignToColor};">${splittedLetters[0] ? splittedLetters[0].charAt(0) : ''}${splittedLetters[1] ? splittedLetters[1].charAt(0) : ''}</div>
        `;
        checkedContacts.push({
            'name': assignTo,
            'color': assignToColor
        });
        assignToArrayFunction(j);
    }
}

function assignToArrayFunction(j) {
    for (let k = 0; k < loadedContacts.length; k++) {
        let contactIndex = loadedContacts.findIndex(contact => contact.name === checkedContacts[j].name);
        document.getElementById(`checkbox_${contactIndex}`).checked = true;
    }
}

/** Saves the edited changes for a task.* @param {number} id - The ID of the task to be edited*/
async function saveEditChanges(id) {
    let task = tasks.find(task => task.id === id);
    let titleEdit = document.getElementById('overview-edit-title-input').value;
    let descriptionArea = document.getElementById('description-overview-edit').value;
    let dueDateInput = document.getElementById('due-date-edit').value;
    task.title = titleEdit;
    task.description = descriptionArea;
    task.date = dueDateInput;
    task['assign-to'] = checkedContacts;
    task['subtasks'] = subtasksArray;
    task.priority = priorityVariable;
    await setItem('tasks', JSON.stringify(tasks));
    clearArrays();
    closeEditCard();
}

/*** Clear the checkedContacts and subtasksArray arrays.*/
function clearArrays() {
    checkedContacts = [];
    subtasksArray = [];
}