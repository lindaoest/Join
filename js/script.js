let signedUpUsers = [];
/**
 * Initialize the function asynchronously.
 *
 */
async function init() {
    loadUsers();
}
/**
 * Asynchronously loads the users and handles any potential loading errors.
 *
 * @param {none} - no parameters
 * @return {none} - no return value
 */
async function loadUsers(){
    try {
		if(signedUpUsers) {
			signedUpUsers = JSON.parse(await getItem('signedUpUsers'));
		}
    } catch(e){
        console.error('Loading error:', e);
    }
}
/**
 * Asynchronous function for user sign up. 
 *
 * @param {void} none
 * @return {void} none
 */
async function signUp() {
	let name = document.getElementById('input-name');
	let password = document.getElementById('input-password');
	let confirm = document.getElementById('input-confirm');
	let email = document.getElementById('input-email');
	let checkbox = document.getElementById('input-checkbox');

	if(password.value === confirm.value) {
		privacyUnchecked(checkbox, name, password, email, confirm);
	} else {
		let passwordIncorrect = document.getElementById('error-password');
		passwordIncorrect.innerHTML = 'Das Passwort stimmt nicht überein';
		setTimeout(() => {
			passwordIncorrect.innerHTML = '';
		}, 2000)
	}
}

async function privacyUnchecked(checkbox, name, password, email, confirm) {
	if(checkbox.checked) {
		let signedUpUser = {
			'name' : name.value,
			'password': password.value,
			'email': email.value
		};
		signedUpUsers.push(signedUpUser);

		await setItem('signedUpUsers', JSON.stringify(signedUpUsers));
		resetForm(email, password, confirm, name, checkbox);
		showSuccessButton();
		window.location.href = './index.html';
	} else {
		let privacyUnchecked = document.getElementById('error-privacy');
		privacyUnchecked.innerHTML = 'Bitte bestätige unsere Privacy Policy';
		setTimeout(() => {
			privacyUnchecked.innerHTML = '';
		}, 2000)
	}
}

/**
 * Resets the form fields and checkbox to their default values.
 *
 * @param {String} email - the email input field
 * @param {String} password - the password input field
 * @param {String} confirm - the confirm password input field
 * @param {String} name - the name input field
 * @param {Checkbox} checkbox - the checkbox input field
 */
async function resetForm(email, password, confirm, name, checkbox) {
	name.value = '';
	email.value = '';
	password.value = '';
	confirm.value = '';
	checkbox.checked = false;
}

/**
 * Displays the success lightbox and animates the success button.
 *
 * @param {type} None
 * @return {type} None
 */
function showSuccessButton() {
	let successLightbox = document.getElementById('success-lightbox');
	let successButton = document.getElementById('success');
	successLightbox.style.display = 'flex';
	setTimeout(() => {
		successButton.style.transition = 'transform 1s ease-in-out';
		successButton.style.transform = 'translateY(30%)';

		setTimeout(() => {
			successLightbox.style.display = 'none';
            successButton.style.transform = 'translateY(100%)';
        }, 2000);
	}, 150)
}


