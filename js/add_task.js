let checkedContacts = [];
let categories = ['Technical Task', 'User Story'];
let subtasksArray = [];
let priorityVariable = 'Medium';
let toDo = 'to-do';
let currentSubtask;
let finishedSubtasks = [];
let titleLock = true;
let dateLock = true;
let categoryLock = true;
let title = document.getElementById('title');
let description = document.getElementById('description');
let dateDue = document.getElementById('due-date');
let categoryValue = document.getElementById('category');
let contactsList = document.getElementById('contacts-list');
let contactsListMobile = document.getElementById('contacts-list-mobile');
let buttonCreateTask = document.getElementById('button-create-task');
let timestamp = getTimestampId();

/*** Renders the task by loading tasks, contacts, and categories, getting contacts, and setting the active page.*/
async function renderTask() {
    await loadTasks();
    await loadContacts();
    getCategories();
	getContacts();
    setActivePage2();
}
if(title) {
    title.addEventListener('input', function() {
        if(this.value !== '') {
            titleLock = false;
        }
        if(!titleLock && !dateLock && !categoryLock) {
            enableAddTaskButton();
        }
    })
}
if(dateDue) {
    dateDue.addEventListener('input', function() {
        if(this.value !== '') {
            dateLock = false;
        }
        if(!titleLock && !dateLock && !categoryLock) {
            enableAddTaskButton();
        }
    })
}

/*** Enables the add task button on the page.*/
function enableAddTaskButton() {
    let buttonCreateTask = document.getElementById('button-create-task');
    buttonCreateTask.disabled = false;
}

/** Creates a new task with the given status and stores it in the tasks array. 
 * @param {string} status - The status of the new task
 * @return {Promise<void>} A promise that resolves when the task is created and stored
 */
async function createNewTask(status) {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let dateDue = document.getElementById('due-date');
    let categoryValue = document.getElementById('category');
    let buttonCreateTask = document.getElementById('button-create-task');
    tasks.push({
        'id': timestamp,
        'title': title.value,
        'description': description.value,
        'assign-to': checkedContacts,
        'date': dateDue.value,
        'priority': priorityVariable,
        'category': categoryValue.value,
        'subtasks': subtasksArray,
        'finishedSubtasks': finishedSubtasks,
        'status': status
    })
    await setItem('tasks', JSON.stringify(tasks));
    clearFields();
    successLightbox();
    buttonCreateTask.disabled = true;
    setTimeout(() => {
        window.location.href = './board.html';
    }, 2050)
}

/** Function to display a success lightbox and animate a success button*/
function successLightbox() {
    let successLightbox = document.getElementById('success-lightbox');
	let successButton = document.getElementById('success');
	successLightbox.style.display = 'flex';
	setTimeout(() => {
        successLightbox.style.zIndex = '2';
		successButton.style.transition = 'transform 1s ease-in-out';
		successButton.style.transform = 'translateY(30%)';
		setTimeout(() => {
			successLightbox.style.display = 'none';
            successButton.style.transform = 'translateY(100%)';
            successLightbox.style.zIndex = '-1';
        }, 2000);
	}, 150)
}

/*** Clears all the input fields and removes any selected options or values.*/
function clearFields() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let dateDue = document.getElementById('due-date');
    let assignToMobile = document.getElementById('contacts-list-mobile');
    let addedContacts = document.getElementById('added-contacts');
    let addedContactsMobile = document.getElementById('added-contacts-mobile');
    let subtasks = document.getElementById('list-item-subtasks');
    let priorityButtonMedium = document.getElementById(`priority-medium`);
    assignToMobile.classList.add('d-none');
    assignToMobile.classList.remove('block');
    addedContacts.innerHTML = '';
    addedContactsMobile.innerHTML = '';
    removePriority();
    priorityButtonMedium.classList.add('medium');
    subtasks.innerHTML = '';
    subtasksArray = [];
    checkedContacts = [];
    let checkbox = document.querySelectorAll('.checkbox');
    checkbox.forEach(function(event) {
        event.checked = false;
    })
	title.value = '';
	description.value = '';
	dateDue.value = '';
	category.value = '';
}

/**
 * Opens an overlay for a given list ID when triggered by an event. 
 * @param {Event} event - The event that triggers the overlay opening
 * @param {string} listId - The ID of the list to open the overlay for*/
function openOverlay(event, listId) {
    event.stopPropagation();
    let overlayList = document.getElementById(`${listId}`);
    overlayList.classList.toggle('active');
}
/**
 * Closes the overlay by removing the 'active' class from the specified elements.*/
function closeOverlay() {
    let overlayList = document.getElementById('contacts-list');
    let overlayListMobile = document.getElementById('contacts-list-mobile');
    let categoriesList = document.getElementById('categories-list');
    overlayList.classList.remove('active');
    overlayListMobile.classList.remove('active');
    categoriesList.classList.remove('active');
}
/**
 * Retrieves the contacts and generates the corresponding HTML for display.
 */
function getContacts() {
    for (let i = 0; i < loadedContacts.length; i++) {
        let contactName = loadedContacts[i]['name'];
        let splittedLetters = contactName.split(" ");
        let contactColor = loadedContacts[i]['color'];
        document.getElementById('list-item').innerHTML += generateContactsHtml(splittedLetters, contactName, i, contactColor);

        if (document.getElementById('list-item-mobile')) {
            document.getElementById('list-item-mobile').innerHTML += generateContactsHtmlMobile(splittedLetters, contactName, i, contactColor, i); // Hier wird die Funktion für die mobile Ansicht aufgerufen
        }
    }
}
/**
 * Generates HTML for a contact with the specified details.
 * @param {array} splittedLetters - Array of letters from the contact name
 * @param {string} contactName - The name of the contact
 * @param {number} i - The index of the contact
 * @param {string} contactColor - The color associated with the contact
 * @return {string} The generated HTML for the contact*/
function generateContactsHtml(splittedLetters, contactName, i, contactColor) {
    return `
        <div class="item flex align-center" onclick="contactChecked(event, ${i})">
            <div class="circle" style="background-color : ${contactColor}">${splittedLetters[0] ? splittedLetters[0].charAt(0) : ''}${splittedLetters[1] ? splittedLetters[1].charAt(0) : ''}</div>
            <label for="checkbox_${i}" class="name" data-value="${contactName.toLowerCase()}">${contactName}</label>
            <input id="checkbox_${i}" type="checkbox" class="checkbox" onchange="syncCheckbox(this, ${i})"> <!-- Hinzufügen der onchange-Funktion, um die Checkbox in der mobilen Ansicht zu synchronisieren -->
        </div>
    `;
}

/*** Generates HTML for a contact with the specified details in mobile.
 * @param {array} splittedLetters - Array of letters from the contact name
 * @param {string} contactName - The name of the contact
 * @param {number} i - The index of the contact
 * @param {string} contactColor - The color associated with the contact
 * @param {number} mobileIndex - The index of the contact in mobile view
 * @return {string} The generated HTML for the contact
 */
function generateContactsHtmlMobile(splittedLetters, contactName, i, contactColor, mobileIndex) {
    return `
        <div class="item flex align-center" onclick="contactChecked(event, ${mobileIndex})">
            <div class="circle" style="background-color : ${contactColor}">${splittedLetters[0] ? splittedLetters[0].charAt(0) : ''}${splittedLetters[1] ? splittedLetters[1].charAt(0) : ''}</div>
            <label for="checkbox-mobile_${mobileIndex}" class="name" data-value="${contactName.toLowerCase()}">${contactName}</label>
            <input id="checkbox-mobile_${mobileIndex}" type="checkbox" class="checkbox" onchange="syncCheckbox(this, ${mobileIndex})"> <!-- Hinzufügen der onchange-Funktion, um die Checkbox in der Desktop-Ansicht zu synchronisieren -->
        </div>
    `;
}
/** Synchronizes the state of a checkbox between desktop and mobile views.
 * @param {HTMLInputElement} checkbox - The checkbox element triggering the synchronization.
 * @param {number} index - The index of the checkbox element in the contact list.*/

function syncCheckbox(checkbox, index) {
    const desktopCheckbox = document.getElementById(`checkbox_${index}`);
    const mobileCheckbox = document.getElementById(`checkbox-mobile_${index}`);
    desktopCheckbox.checked = checkbox.checked;
    mobileCheckbox.checked = checkbox.checked;
}

/**
 * Handles the checkbox event for a contact.
 * @param {Event} event - the event object
 * @param {number} index - the index of the contact*/
function contactChecked(event, index) {
    event.stopPropagation();
    let checkbox = event.target;
    let contactName = loadedContacts[index]['name'];
    let contactColor = loadedContacts[index]['color'];
    let addedContacts = document.getElementById('added-contacts');
    let addedContactsMobile = document.getElementById('added-contacts-mobile');
    if (checkbox.checked) {
        checkboxChecked(contactName, contactColor);
    } else {
        checkboxUnchecked(contactName);
    }
    addedContacts.innerHTML = '';
    if(addedContactsMobile) {
        addedContactsMobile.innerHTML = '';
    }
    if(checkedContacts.length > 0) {
        generateAddedContacts(addedContacts, addedContactsMobile);
    }
}

function checkboxChecked(contactName, contactColor) {
    // Checkbox wurde ausgewählt
    let includedName = checkedContacts.find(c => c.name == contactName)
    if (!checkedContacts.includes(includedName)) {
        checkedContacts.push({
            'name': contactName,
            'color': contactColor
        });
    }
}

function checkboxUnchecked(contactName) {
    // Checkbox wurde abgewählt
    let indexToRemove = checkedContacts.findIndex(c => c.name == contactName);
    if (indexToRemove !== -1) {
        checkedContacts.splice(indexToRemove, 1);
    }
}

function generateAddedContacts(addedContacts, addedContactsMobile) {
    for (let j = 0; j < checkedContacts.length; j++) {
        let checkedContact = checkedContacts[j];
        let splittedLetters = checkedContact['name'].split(" ");
        let contactColor = checkedContact['color'];

        addedContacts.innerHTML += `
            <div class="circle" style="background-color:${contactColor}">${splittedLetters[0] ? splittedLetters[0].charAt(0) : ''}${splittedLetters[1] ? splittedLetters[1].charAt(0) : ''}</div>
        `;
        if(addedContactsMobile) {
            addedContactsMobile.innerHTML += `
                <div class="circle" style="background-color:${contactColor}">${splittedLetters[0] ? splittedLetters[0].charAt(0) : ''}${splittedLetters[1] ? splittedLetters[1].charAt(0) : ''}</div>
            `;
        }
    }
}

/*** Retrieves the categories and dynamically generates HTML elements for each category.*/
function getCategories() {
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        document.getElementById('list-item-category').innerHTML += `
        <div class="item-category flex align-center">
            <div class="name" data-value="${category.toLowerCase()}" onclick="addCategory(${i})">${category}</div>
        </div>
        `;
    }
}

/*** A function that adds a category based on the index provided.
 * @param {number} i - The index of the category to be added.
 * @return {undefined} This function does not return anything.*/
function addCategory(i) {
    let category = categories[i]
    document.getElementById('category').value = `${category}`;
    let overlayList = document.getElementById('categories-list');
    overlayList.classList.remove('active');
    categoryLock = false;
    if(!titleLock && !dateLock && !categoryLock) {
        enableAddTaskButton();
    }
}

/*** Selects the priority button and updates the priority variable.
 * @param {string} priority - The priority value to be selected*/
function selectPriority(priority) {
    let priorityButton = document.getElementById(`priority-${priority}`);
    removePriority()
    priorityButton.classList.add(`${priority}`);
    priorityVariable = priorityButton.textContent;
}

/** Remove priority classes from all elements with the class 'priority-button' */
function removePriority() {
    let buttons = document.querySelectorAll('.priority-button');
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        button.classList.remove('urgent', 'medium', 'low', 'urgent-mobile', 'medium-mobile', 'low-mobile');
    }
}
/**Changes the icons on the webpage.*/
function changeIcons() {
    let subtaskPlus = document.getElementById('subtasks-plus');
    let subtaskIcons = document.getElementById('image-click');
    subtaskPlus.classList.add('d-none');
    subtaskIcons.classList.remove('d-none');
    subtaskIcons.classList.add('flex');
}

/*** Adds a subtask to the list of subtasks.
* @param {type} inputSubtask - the input element for the subtask
 * @param {type} listItemSubtasks - the list item container for subtasks*/
function addSubtask() {
    let inputSubtask = document.getElementById('subtasks');
    let listItemSubtasks = document.getElementById('list-item-subtasks');
    listItemSubtasks.innerHTML += generateAddSubtask(inputSubtask);
    subtasksArray.push(`${inputSubtask.value}`);
    inputSubtask.value = '';
}

function generateAddSubtask(inputSubtask) {
    return `
    <li class="subtaskItem">
        <div id="editableText" class="li-element flex space-between align-center">
            <p>${inputSubtask.value}</p>
            <div id="edit-delete-icons" class="edit-delete-icons flex">
                <img onclick="editSubtask(event)" id="subtasks-edit" class="subtasks-edit" src="./img/edit-subtask.svg" alt="Edit">
                <img onclick="clearSubtask(event)" id="subtasks-delete" class="subtasks-delete" src="./img/delete-subtask.svg" alt="Delete">
            </div>
        </div>
    </li>`;
}

/*** Clears the input field for subtasks.*/
function clearSubtaskInput() {
    let inputSubtask = document.getElementById('subtasks');
    inputSubtask.value = '';
}
/*** Edit a subtask by making it editable and allowing the user to save the changes.
 * @param {Event} event - the event triggering the subtask edit*/
function editSubtask(event) {
    let textElement = event.target.closest('#editableText');
    textElement.contentEditable = true;
    textElement.focus(); // Den Fokus auf das bearbeitbare Element setzen
    currentSubtask = textElement.innerText;
    let edit = event.target.closest('#edit-delete-icons');
    edit.innerHTML = '';
    edit.innerHTML = `
        <img onclick="clearSubtask(event)" id="subtasks-delete" class="subtasks-delete" src="./img/delete-subtask.svg" alt="Delete">
        <img onclick="saveEditSubtask(event)" class="subtasks-check" src="./img/check-blue.svg" alt="">
    `;
}

/*** Removes the specified subtask element from the DOM and the subtasksArray.* @param {Event} event - The event object */
function clearSubtask(event) {
    let deleteSubtask = event.target.closest('.subtaskItem');
    deleteSubtask.remove();
    let index = subtasksArray.indexOf(deleteSubtask.innerText.trim());
    if(index !== -1) {
        subtasksArray.splice(index, 1);
    }
}
/** Asynchronously saves the edited subtask and updates the UI accordingly.*@param {Object} event - The event object triggered by the user action
 * @return {Promise} A promise that resolves after the subtask is saved*/
async function saveEditSubtask(event) {
    let textElement = event.target.closest('#editableText');
    textElement.contentEditable = false;
    let indexOfsubtask = subtasksArray.indexOf(currentSubtask);
    subtasksArray[indexOfsubtask] = textElement.innerText.trim();
    let edit = event.target.closest('#edit-delete-icons');
    edit.innerHTML = '';
    edit.innerHTML = `
        <img onclick="editSubtask()" id="subtasks-edit" class="subtasks-edit" src="./img/edit-subtask.svg" alt="Edit">
        <img onclick="clearSubtask(event)" id="subtasks-delete" class="subtasks-delete" src="./img/delete-subtask.svg" alt="Delete">
    `;
    currentSubtask = '';
}
/**Generates and returns a timestamp ID.* @return {number} timestamp ID generated by the function*/
function getTimestampId() {
    let timestamp = new Date().getTime();
    return timestamp;
}