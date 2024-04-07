let prioritySummaryVariable = 0;
let toDoVariable = 0;
let doneVariable = 0;
let tasksInProgressVariable = 0;
let awaitingFeedbackVariable = 0;
let toDo = document.getElementById('to-do');
let done = document.getElementById('done');
let tasksInBoard = document.getElementById('tasks-in-board');
let tasksInProgress = document.getElementById('tasks-in-progress');
let awaitingFeedback = document.getElementById('awaiting-feedback');
let datesUrgent = [];
let urgentDate = document.getElementById('urgent-date');
let greeting = document.getElementById('greeting');
let greetingMobile = document.getElementById('greeting-mobile');

/**
 * Renders the summary by loading tasks, getting the greeting and login name, updating the tasks in the board, looping through tasks, getting the date from input, and setting the active page. If the window width is less than 1170, it also triggers the overlay greeting for mobile view.
 *
 * @return {Promise<void>} 
 */
async function renderSummary() {
	await loadTasks();
	getGreeting();
	getLoginName();
	tasksInBoard.innerHTML = tasks.length;
	loopTasks();
	getDateFromInput();
	setActivePage1();
	if(window.innerWidth < 1170) {
		overlayGreetingMobile();
	}
}
/*** Function to overlay greeting on mobile view.*/
function overlayGreetingMobile() {
	let overlayGreetingMobile = document.getElementById('overlay-greeting-mobile');
	setTimeout(() => {
		overlayGreetingMobile.style.zIndex = '10';
		overlayGreetingMobile.style.transition = 'all 1s ease-in-out';
		overlayGreetingMobile.style.opacity = '1';
	}, 500)
	setTimeout(() => {
		overlayGreetingMobile.style.zIndex = '-1';
		overlayGreetingMobile.style.transition = 'all 1s ease-in-out';
		overlayGreetingMobile.style.opacity = '0';
	}, 3000)
}

/*** Loop through tasks and perform certain actions based on priority.*/
function loopTasks() {
	for (let i = 0; i < tasks.length; i++) {
		let task = tasks[i];
		let priority = task['priority'];
		if(priority === 'Urgent') {
			let urgentHeading = document.getElementById('urgent-heading');
			prioritySummaryVariable++
			urgentHeading.innerHTML = prioritySummaryVariable;
			datesUrgent.push(task['date'])
		}
		checkStatus(i);
	}
}

/**
 * Check the status of a task and update the corresponding variables and HTML elements.
 *
 * @param {number} i - Index of the task to check
 * @return {void} 
 */
function checkStatus(i) {
	let task = tasks[i];
	let status = task['status'];
	if(status === 'to-do') {
		toDoVariable++;
		toDo.innerHTML = toDoVariable;
	} else if(status === 'done-tasks') {
		doneVariable++
		done.innerHTML = doneVariable;
	} else if(status === 'tasks-in-progress') {
		tasksInProgressVariable++
		tasksInProgress.innerHTML = tasksInProgressVariable;
	} else if(status === 'awaiting-feedback') {
		awaitingFeedbackVariable++
		awaitingFeedback.innerHTML = awaitingFeedbackVariable
	}
}

/**
 * Retrieves the closest date from the 'datesUrgent' array and displays it in the 'urgentDate' element. If 'datesUrgent' is empty, it displays 'No urgent task!'.
 * @param {type} None*/
function getDateFromInput() {
	if(datesUrgent.length > 0) {
		let currentDate = new Date();
		function dateDifferenceInDays(date1, date2) {
			const oneDay = 24 * 60 * 60 * 1000; 
			const diffInMilliseconds = Math.abs(date1 - date2);
			return Math.round(diffInMilliseconds / oneDay);
		}
		let dateObjects = datesUrgent.map(function(dateString) {
			let dateParts = dateString.split("-");
			return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); 
		});
		let closestDate = dateObjects.reduce(function (prev, curr) {
			let prevDiff = dateDifferenceInDays(currentDate, prev);
			let currDiff = dateDifferenceInDays(currentDate, curr);
			return currDiff < prevDiff ? curr : prev;
		});
		let formattedDate = closestDate.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
		urgentDate.innerHTML = formattedDate;
	} else {
		urgentDate.innerHTML = 'No urgent task!';
	}
}
/*** This function gets the current time and sets a greeting text based on the time of day.
 * @param {} 
 * @return {}*/
function getGreeting() {
	let currentDate = new Date();
	let currentTime = currentDate.getHours();
	let greetingText;
	switch (true) {
		case currentTime >= 4 && currentTime < 12:
			greetingText = 'Good morning,';
			break;
		case currentTime >= 12 && currentTime < 17:
			greetingText = 'Good afternoon,';
			break;
		case currentTime >= 17 && currentTime < 23:
			greetingText = 'Good evening,';
			break;
		default:
			greetingText = 'Good night,';
	}
	greeting.textContent = greetingText;
	greetingMobile.textContent = greetingText;
}
/** Retrieves the login name and updates the logged-in person's name in the DOM if logged in as a guest or with a name.
 * @return {undefined} No return value*/
function getLoginName() {
	if(logedInAsGuest) {
		document.getElementById('loged-in-person').textContent = logedInGuest;
		document.getElementById('loged-in-person-mobile').textContent = logedInGuest;
	} else if(logedInWithName) {
		document.getElementById('loged-in-person').textContent = logedInPerson;
		document.getElementById('loged-in-person-mobile').textContent = logedInPerson;
	}
}