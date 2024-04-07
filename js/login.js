/**
 * Function to attempt login using provided email and password.
 * @param {type} email - input email element
 * @param {type} password - input password element
 * @return {type} description of return value
 */
function login() {
	let email = document.getElementById('input-email');
	let password = document.getElementById('input-password');
	for (let i = 0; i < signedUpUsers.length; i++) {
		let signedUpUser = signedUpUsers[i];
		if(email.value == signedUpUser.email && password.value == signedUpUser.password) {
			logedInPerson = signedUpUser['name'];
			logedInWithName = true;
			checkEmail(logedInPerson, logedInWithName);
			window.location.href = './summary.html';
			return;
		}
	}
	resetForm(email, password)
	showError();
}

function checkEmail(logedInPerson, logedInWithName) {
	if(logedInWithName) {
		localStorage.setItem('logedIn Person', JSON.stringify(logedInPerson));
		localStorage.setItem('logedIn with Name', JSON.stringify(logedInWithName));
	}
}

/**
 * Resets the values of the email and password fields.
 * @param {object} email - The email input field
 * @param {object} password - The password input field
 * @return {Promise<void>} 
 */
async function resetForm(email, password) {
	email.value = '';
	password.value = '';
}
/**
 * Display an error message for users who are not logged in.
 *
 * @param {type} noLogedIn - the element to display the error message in
 * @return {type} undefined
 */
function showError() {
	let noLogedIn = document.getElementById('error-info');
	noLogedIn.innerHTML = 'Du bist nicht angemeldet.';
}

/**
 * Logs the user in as a guest and sets the 'logedIn as Guest' item in the local storage.
 */
function guestLogin() {
	logedInAsGuest = true;
	if(logedInAsGuest) {
		localStorage.setItem('logedIn as Guest', JSON.stringify(logedInAsGuest));
	}
}