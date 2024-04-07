/**
 * Returns a string representing an HTML form for adding a new task.
 *
 * @param {string} status - The status of the task
 * @return {string} The HTML form for adding a new task
 */
function returnTask(status) {
	return `
	<div id="add-task" class="add_task flex-column">
        <div class="flex align-center">
            <h1>Add Task</h1>
            <img onclick="closeAddTaskPopup()" class="close" src="./img/close.png">
        </div>
		<form onsubmit="createNewTask('${status}'); return false;">
            <div class="form-container flex">
                <div class="leftside flex-column">
                    <div class="task-input task-title">
                        <label for="title">Title<span class="required-fields">*</span></label>
                        <input id="title" type="text" placeholder="Enter a Title" required>
                    </div>
                    <div class="task-input task-description">
                        <label for="description">Description</label>
                        <textarea name="description" id="description" cols="30" rows="7" placeholder="Enter a Description"></textarea>
                    </div>
                    <div class="task-input task-prio">
                        <label for="prio">Prio</label>
                        <div class="buttons flex">
                            <div id="priority-urgent-mobile" class="priority-urgent priority-button" onclick="selectPriority('urgent-mobile')">Urgent</div>
                            <div id="priority-medium-mobile" class="priority-medium priority-button medium" onclick="selectPriority('medium-mobile')">Medium</div>
                            <div id="priority-low-mobile" class="priority-low priority-button" onclick="selectPriority('low-mobile')">Low</div>
                        </div>
                    </div>
                    <div class="task-input task-assigned-to">
                        <label for="assign-to">Assign to</label>
                        <div class="position-relative flex-column m-t-8">
                            <input onclick="openOverlay(event, 'contacts-list')" id="assign-to" type="text" placeholder="Select contacts to assign" readonly>
                            <img onclick="openOverlay(event, 'contacts-list')" class="dropdown" src="./img/arrow_dropdown.svg" alt="arrow dropdown" tabindex="0">
                        </div>
                        <div id="contacts-list" class="contacts-list">
                            <div id="list-item" class="list-item"></div>
                        </div>
                        <div id="added-contacts" class="flex flex-wrap"></div>
                    </div>
                </div>
                <div class="rightside flex-column">
                    <div class="task-input task-date">
                        <label for="due-date">Due Date<span class="required-fields">*</span></label>
                        <input type="date" id="due-date" value="dd/mm/yyyy" required>
                    </div>
                    <div class="task-input task-prio">
                        <label for="prio">Prio</label>
                        <div class="buttons flex">
                            <div id="priority-urgent" class="priority-urgent priority-button" onclick="selectPriority('urgent')">Urgent</div>
                            <div id="priority-medium" class="priority-medium priority-button medium" onclick="selectPriority('medium')">Medium</div>
                            <div id="priority-low" class="priority-low priority-button" onclick="selectPriority('low')">Low</div>
                        </div>
                    </div>
                    <div id="task-category" class="task-input task-category">
                        <label for="category">Category<span class="required-fields">*</span></label>
                        <div class="position-relative flex-column m-t-8">
                            <input onclick="openOverlay(event, 'categories-list')" id="category" type="text" placeholder="Select task category" required readonly>
                            <img onclick="openOverlay(event, 'categories-list')" class="dropdown" src="./img/arrow_dropdown.svg" alt="arrow dropdown">
                        </div>
                        <div id="categories-list" class="categories-list">
                            <div id="list-item-category" class="list-item-category"></div>
                        </div>
                    </div>
                    <div class="task-input task-assigned-to">
                        <label for="assign-to-mobile">Assign to</label>
                        <div class="position-relative flex-column m-t-8">
                            <input onclick="openOverlay(event, 'contacts-list-mobile')" id="assign-to-mobile" type="text" placeholder="Select contacts to assign" readonly>
                            <img onclick="openOverlay(event, 'contacts-list-mobile')" class="dropdown" src="./img/arrow_dropdown.svg" alt="arrow dropdown" tabindex="0">
                        </div>
                        <div id="contacts-list-mobile" class="contacts-list">
                            <div id="list-item-mobile" class="list-item"></div>
                        </div>
                        <div id="added-contacts-mobile" class="flex flex-wrap"></div>
                    </div>
                    <div class="task-input task-subtasks">
                        <label for="subtasks">Subtasks</label>
                        <input onclick="changeIcons()" id="subtasks" type="text" placeholder="Add new Subtask">
                        <div id="subtasks-list" class="subtasks-list">
                            <ul id="list-item-subtasks" class="list-item-subtasks"></ul>
                        </div>
                        <img id="subtasks-plus" class="subtasks-plus" src="./img/plus.svg" alt="">
                        <div id="image-click" class="image-click d-none">
                            <img onclick="clearSubtaskInput()" class="subtasks-clear" src="./img/clear.svg" alt="">
                            <img onclick="addSubtask()" class="subtasks-check" src="./img/check-blue.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
			<div class="buttons-bottom flex align-center space-between">
				<div class="required-text">
					<p>This fields are required<span class="required-fields">*</span></p>
				</div>
				<div class="flex buttons">
					<button type="button" class="button1" onclick="clearFields()" formnovalidate>Clear</button>
					<button type="submit" id="button-create-task" class="button2" disabled>Create task</button>
				</div>
			</div>
		</form>
		<div id="success-lightbox" class="success-lightbox flex align-center justify-center">
            <div id="success" class="success flex">
                <button>Task added to board</button>
            </div>
        </div>
	</div>
	`;
}

/**
 * Generate an HTML template for an overview card.
 *
 * @param {string} category - The category of the task
 * @param {string} title - The title of the task
 * @param {string} description - The description of the task
 * @param {string} date - The due date of the task
 * @param {string} priority - The priority of the task
 * @param {object} task - The task object
 * @return {string} The HTML template for the overview card
 */
function createOverviewHTMLTemplate(category, title, description, date, priority, task){
	return `
    <div class="type-close">
        <button class="task-type task-type-overview">${category}</button>
        <img onclick="closeTaskOverview()" src="./img/close.png">
    </div>
    <div id="overview-card-top">
        <p id="overview-title">${title}</p>
        <p id="overview-details">${description}</p>
        <div class="overview-date">
            <p>Due date: </p>
            <p>${date.replace(/-/g, '/')}</p>
        </div>
        <div class="overview-priority">
            <p>Priority:</p>
            <p>${priority ? `${priority} <img src="./img/prio-${priority}.svg">` : 'No priority'}</p>
        </div>
    </div>
    <div id="assigned-to-overview" class="assigned-to-overview">
        <p>Assigned To:</p>
        ${generateAssignTo(task.id)}
    </div>
    <div class="subtasks-overview">
        <p>Subtasks</p>
        ${generateSubtasks(task.id)}
    </div>
    <div class="overview-bottom-buttons">
        <div onclick="openMoveTaskMenu(event)" class="clickbox-open-menu flex align-center position-relative">
            <div class="move-task flex align-center">
                <img src="./img/arrow-down.svg">
                <p>Move task to</p>
            </div>
            <div id="open-move-task">
                <p onclick="moveTaskMobile(${task.id}, 'to-do')">To do</p>
                <p onclick="moveTaskMobile(${task.id}, 'in-progress')">In progress</p>
                <p onclick="moveTaskMobile(${task.id}, 'await-feedback')">Await feedback</p>
                <p onclick="moveTaskMobile(${task.id}, 'done-tasks')">Done</p>
            </div>
        </div>
        <button class="delete-overview" onclick="deleteTask(${task.id})">
            <img src="./img/delete-subtask.svg">
            <p>Delete</p>
        </button>
        <button class="edit-overview" onclick="editTaskOverview(${task.id})">
            <img src="./img/edit-subtask.svg">
            <p>Edit</p>
        </button>
    </div>
    `;
}

/**
 * Generates an HTML template for editing a task.
 *
 * @param {object} task - the task to be edited
 * @return {string} the HTML template for editing the task
 */
function generateEditTaskHTMLTemplate(task) {
	return `
    <form onsubmit="saveEditChanges(${task.id}); return false">
        <div class="main-edit-card">
            <div id="overview-edit-top">
                <div class="close-edit" onclick="closeTaskOverview()"><img src="./img/close.png"> </div>
                <p id="overview-edit-title">Title</p>
                <input id="overview-edit-title-input" required placeholder="Enter a title" type="text" value="Kochwelt Page & Recipe Recommender">
            </div>
            <div class="overview-edit-description">
                <p>Description</p>
                <textarea name="description" id="description-overview-edit" cols="30" rows="5"></textarea>
            </div>
            <div class="due-date-overview-edit overview-edit-description">
                <p>Due date</p>
                <input required id="due-date-edit" type="date">
            </div>
            <div class="overview-edit-description">
                <p class="priority-overview-edit">Priority</p>
                <div class="priority-edit-buttons">
                    <div class="task-input task-prio-overview-edit">
                        <div class="buttons flex task-prio-overview-edit">
                            <div id="priority-urgent" class="priority-urgent priority-button" onclick="selectPriority('urgent')">Urgent</div>
                            <div id="priority-medium" class="priority-medium priority-button medium" onclick="selectPriority('medium')">Medium</div>
                            <div id="priority-low" class="priority-low priority-button" onclick="selectPriority('low')">Low</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="assigned-to-overview-edit">
                <div id="task-assigned-to" class="task-input task-assigned-to">
                    <label for="assign-to">Assign to</label>
                    <div class="position-relative flex-column m-t-8">
						<input onclick="openOverlay(event, 'contacts-list')" id="assign-to" type="text" placeholder="Select contacts to assign" readonly>
						<img onclick="openOverlay(event, 'contacts-list')" class="dropdown" src="./img/arrow_dropdown.svg" alt="arrow dropdown" tabindex="0">
					</div>
                    <div id="contacts-list" class="contacts-list">
                    <div id="list-item" class="list-item"></div>
                    </div>
                    <div id="added-contacts" class="flex"></div>
                </div>
            </div>
            <div class="task-input task-subtasks">
                <label for="subtasks">Subtasks</label>
                <input onclick="changeIcons()" id="subtasks" type="text" placeholder="Add new Subtask">
                <div id="subtasks-list" class="subtasks-list">
                    <ul id="list-item-subtasks" class="list-item-subtasks list-height"></ul>
                </div>
                <img id="subtasks-plus" class="subtasks-plus" src="./img/plus.svg" alt="">
                <div id="image-click" class="image-click d-none">
                    <img onclick="clearSubtaskInput()" class="subtasks-clear" src="./img/clear.svg" alt="">
                    <img onclick="addSubtask()" class="subtasks-check" src="./img/check-blue.svg" alt="">
                </div>
            </div>
        </div>
        <div class="edit-ok-button">
            <button class="edit-ok-button-btn">OK <img src="./img/check.png" alt=""></button>
        </div>
    </form>
    `};

    /**
     * A function that generates the HTML template for a task card.
     * @param {any} element - the task element
     * @param {number} index - the index of the task
     * @param {number} progress - the progress of the task
     * @param {array} finishedSubtasks - the array of finished subtasks
     * @param {string} initials - the initials for the task
     * @param {string} additionalContacts - additional contacts for the task
     * @return {string} the HTML template for the task card
     */
    function taskCardHtmlTemplate(element, index, progress, finishedSubtasks, initials, additionalContacts) {
        return `
        <div id="task-card-${index}" class="task-card" draggable="true" ondragstart="startDragging(${element['id']})" onclick="openTaskOverview(${element['id']})">
            <button class="task-type">${element['category']}</button>
            <div class="task-text">
                <p id="task-title">${element['title']}</p>
                <p id="task-details">${element['description']}</p>
            </div>
            <div class="subtasks">
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>
                <div>
                    <p>${finishedSubtasks.length}/${element['subtasks'].length} Subtasks</p>
                </div>
            </div>
            <div class="task-card-bottom">
                <div id="initials">
                    ${initials}
                </div>
                <div id="additionalContacts">
                ${additionalContacts}</div>
                <div>
                    <img id="priority-image-small${index}" src="./img/prio-${element.priority.toLowerCase()}.svg">
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Generates an HTML template for a subtask.
     * @param {type} subtask - description of subtask parameter
     * @param {type} j - description of j parameter
     * @return {type} the generated HTML template for a subtask
     */
    function addSubtaskHtmlTemplate(subtask, j) {
        return `
        <li class="subtaskItem">
            <div id="editableText" class="li-element flex space-between align-center">
                <p>${subtask}</p>
                <div id="edit-delete-icons" class="edit-delete-icons flex">
                    <img onclick="editSubtask(event, ${j})" id="subtasks-edit" class="subtasks-edit" src="./img/edit-subtask.svg" alt="Edit">
                    <img onclick="clearSubtask(event)" id="subtasks-delete" class="subtasks-delete" src="./img/delete-subtask.svg" alt="Delete">
                </div>
            </div>
        </li>
        `;
    }
     

    function OverviewHTML(matchingColor, fullName, initials){
        return `
        <div id="overview-contact">
            <p class="overview-in" style="border-radius: 50%; height: 42px; display: flex; justify-content: center; align-items: center; color: white; width: 42px; background-color: ${matchingColor}">${initials[0] ? initials[0].charAt(0) : ''}${initials[1] ? initials[1].charAt(0) : ''}</p>
            <p id="overview-fullname">${fullName}</p>
        </div>
    `;
    }
